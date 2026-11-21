const nodemailer = require('nodemailer');
const {
  recruitmentInviteTemplate,
  applicationSubmittedTemplate,
  adminNewApplicationTemplate,
  testScheduledTemplate,
  adminTestAppointmentTemplate,
  testerConvocationTemplate,
  applicationAcceptedTemplate,
  applicationRejectedTemplate,
  applicationStatusUpdateTemplate,
  welcomeTemplate,
  adminNewUserAlertTemplate,
  passwordResetCodeTemplate,
  loginAlertTemplate,
  newsletterBroadcastTemplate,
  orderConfirmationTemplate,
  orderShippedTemplate,
  adminNewOrderAlertTemplate
} = require('../utils/emailTemplates');

let transporter = null;

// Creation du transporteur Nodemailer
const getTransporter = async () => {
  if (transporter) return transporter;

  const emailUser = (process.env.EMAIL_USER || '').replace(/['"]/g, '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').replace(/['"]/g, '').trim();

  if (emailUser && emailPass) {
    if (process.env.EMAIL_SERVICE) {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }
    console.log(`[MAILER] Service initialise avec succes (SMTP: ${emailUser}).`);
    return transporter;
  }

  console.warn('[MAILER] Aucune configuration EMAIL_USER / EMAIL_PASS trouvee dans dwt-backend/.env.');
  return null;
};

// Fonction generique d'envoi d'email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const client = await getTransporter();

    if (!client) {
      const errDetail = "Le service d'email n'est pas configure sur le serveur (EMAIL_USER et EMAIL_PASS manquants dans dwt-backend/.env).";
      console.warn(`[MAILER] Impossible d'acheminer l'email a ${to} : EMAIL_USER ou EMAIL_PASS manquant.`);
      return { success: false, notConfigured: true, error: errDetail };
    }

    const emailUser = (process.env.EMAIL_USER || '').replace(/['"]/g, '').trim();
    const fromAddress = process.env.EMAIL_FROM || (emailUser ? `"Dark Wolf Team" <${emailUser}>` : '"Dark Wolf Team" <no-reply@darkwolfteam.gg>');

    const info = await client.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || ''
    });

    console.log(`[MAILER] Email envoye avec succes a ${to} [ID: ${info.messageId || 'ok'}]`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAILER] Erreur lors de l'envoi de l'email a ${to} :`, error.message);
    return { success: false, error: `Erreur d'envoi d'email : ${error.message}` };
  }
};

// 1. Invitation a remplir le formulaire de recrutement (envoyee si un utilisateur non accepte tente de s'inscrire)
const sendRecruitmentInviteEmail = async (email, recruitmentUrl) => {
  const html = recruitmentInviteTemplate(email, recruitmentUrl);
  return await sendEmail({
    to: email,
    subject: 'Dark Wolf Team : Formulaire Officiel de Recrutement Joueur',
    html,
    text: `Bonjour, l'inscription directe a Dark Wolf Team est reservee aux candidats retenus. Pour postuler au recrutement joueur, veuillez remplir notre formulaire : ${recruitmentUrl}`
  });
};

// 2. Confirmation de reception de candidature au joueur
const sendApplicationSubmittedEmail = async (application) => {
  const html = applicationSubmittedTemplate(application.gamertag, application.game);
  return await sendEmail({
    to: application.email,
    subject: `Dark Wolf Team : Candidature recue pour le roster ${application.game}`,
    html,
    text: `Bonjour ${application.gamertag}, votre candidature pour le roster ${application.game} a bien ete enregistree.`
  });
};

// 3. Alerte admin lors d'une nouvelle candidature
const sendAdminApplicationAlert = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminNewApplicationTemplate(application);
  return await sendEmail({
    to: adminEmail,
    subject: `[Recrutement DWT] Nouvelle candidature de ${application.gamertag} (${application.game})`,
    html,
    text: `Nouvelle candidature recue de ${application.gamertag} (${application.game}, rang ${application.rank}). Email: ${application.email}, Discord: ${application.discordTag}.`
  });
};

// 4. Convocation officielle au test de recrutement
const sendTestScheduledEmail = async (application) => {
  const html = testScheduledTemplate(
    application.gamertag,
    application.game,
    application.testDate,
    application.testTime,
    application.testLocation,
    application.testNotes,
    application.testRoom,
    application.discordUrl,
    application.assignedTester
  );
  return await sendEmail({
    to: application.email,
    subject: `Convocation officielle : Test de recrutement Dark Wolf Team (${application.game})`,
    html,
    text: `Bonjour ${application.gamertag}, vous etes convoque pour votre test de recrutement Dark Wolf Team sur ${application.game} le ${application.testDate ? new Date(application.testDate).toLocaleDateString('fr-FR') : ''} a ${application.testTime} dans la salle ${application.testRoom || 'Discord'}. Evaluateur : ${application.assignedTester || 'Staff'}.`
  });
};

// 4b. Confirmation du rendez-vous pour l'administrateur
const sendAdminTestAppointmentEmail = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminTestAppointmentTemplate(
    application.gamertag,
    application.game,
    application.testDate,
    application.testTime,
    application.testRoom,
    application.discordUrl,
    application.assignedTester,
    application.email,
    application.discordTag
  );
  return await sendEmail({
    to: adminEmail,
    subject: `[Agenda DWT] Test planifie : ${application.gamertag} (${application.game}) - ${application.testRoom || 'Salle de Test'}`,
    html,
    text: `Test de recrutement planifie : ${application.gamertag} (${application.game}) le ${application.testDate ? new Date(application.testDate).toLocaleDateString('fr-FR') : ''} a ${application.testTime}. Salle : ${application.testRoom}. Testeur assigne : ${application.assignedTester}.`
  });
};

// 4c. Convocation du testeur / membre de l'equipe assigne
const sendTesterConvocationEmail = async (application, testerEmail, testerName) => {
  if (!testerEmail) return;

  const html = testerConvocationTemplate(
    testerName || application.assignedTester || 'Membre de l equipe',
    application.gamertag,
    application.game,
    application.rank,
    application.discordTag,
    application.testDate,
    application.testTime,
    application.testRoom,
    application.discordUrl,
    application.testNotes
  );
  return await sendEmail({
    to: testerEmail,
    subject: `[Mission Testeur DWT] Session de recrutement ${application.game} : ${application.gamertag}`,
    html,
    text: `Bonjour ${testerName || 'Testeur'}, vous etes assigne pour faire passer le test de recrutement de ${application.gamertag} (${application.game}, rang ${application.rank}) le ${application.testDate ? new Date(application.testDate).toLocaleDateString('fr-FR') : ''} a ${application.testTime} dans la salle ${application.testRoom}.`
  });
};

// 5. Email de felicitation et identifiants generes pour le compte joueur
const sendApplicationAcceptedEmail = async (application, generatedPassword) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5190';
  const loginUrl = `${frontendUrl}/login?identifier=${encodeURIComponent(application.email)}`;
  const html = applicationAcceptedTemplate(
    application.gamertag,
    application.game,
    application.email,
    generatedPassword,
    loginUrl
  );
  return await sendEmail({
    to: application.email,
    subject: `Felicitation : Admission officielle dans la Dark Wolf Team (${application.game})`,
    html,
    text: `Felicitation ${application.gamertag} ! Vous etes officiellement admis dans la Dark Wolf Team sur ${application.game}. Vos identifiants de connexion : Identifiant: ${application.email} - Mot de passe : ${generatedPassword} - Connexion sur : ${loginUrl}`
  });
};

// 6. Email de refus poli et remerciement
const sendApplicationRejectedEmail = async (application, feedbackNotes) => {
  const html = applicationRejectedTemplate(
    application.gamertag,
    application.game,
    feedbackNotes
  );
  return await sendEmail({
    to: application.email,
    subject: `Decision concernant votre candidature Dark Wolf Team (${application.game})`,
    html,
    text: `Bonjour ${application.gamertag}, nous vous remercions pour votre investissement lors du test de recrutement. Votre candidature n'a pas ete retenue pour cette session, mais nous vous encourageons a poursuivre vos entrainements.`
  });
};

// 7. Statut generique
const sendApplicationStatusEmail = async (application, customMessage) => {
  const html = applicationStatusUpdateTemplate(
    application.gamertag,
    application.game,
    application.status,
    customMessage
  );
  const statusLabel = application.status === 'accepted' ? 'Candidature Retenue' : 'Decision du Staff';
  return await sendEmail({
    to: application.email,
    subject: `Dark Wolf Team : ${statusLabel}`,
    html
  });
};

// 8. Email de bienvenue
const sendWelcomeEmail = async (user) => {
  const html = welcomeTemplate(user.gamertag);
  return await sendEmail({
    to: user.email,
    subject: 'Bienvenue dans la Dark Wolf Team',
    html
  });
};

// 9. Alerte admin nouvel utilisateur
const sendAdminNewUserAlert = async (user) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminNewUserAlertTemplate(user);
  return await sendEmail({
    to: adminEmail,
    subject: `[DWT] Nouveau membre enregistre : ${user.gamertag}`,
    html
  });
};

// 10. Code de securite mot de passe
const sendPasswordResetCodeEmail = async (email, gamertag, code, resetLink = '') => {
  const html = passwordResetCodeTemplate(gamertag, code, resetLink);
  return await sendEmail({
    to: email,
    subject: `Code de securite Dark Wolf Team : ${code}`,
    html,
    text: `Bonjour ${gamertag}, votre code de securite est : ${code}.${resetLink ? ` Lien direct : ${resetLink}` : ''}`
  });
};

// 11. Alerte connexion
const sendLoginAlertEmail = async (user, ipAddress, userAgent) => {
  const html = loginAlertTemplate(user.gamertag, ipAddress, userAgent);
  return await sendEmail({
    to: user.email,
    subject: 'Nouvelle connexion detectee a votre compte Dark Wolf Team',
    html
  });
};

// 12. Newsletter
const sendNewsletterBroadcast = async (recipients, subject, content) => {
  if (!recipients || recipients.length === 0) return;
  const html = newsletterBroadcastTemplate(subject, content);
  const toList = recipients.join(', ');
  return await sendEmail({
    to: toList,
    subject: `[Dark Wolf Team] ${subject}`,
    html
  });
};

// 13. Confirmation commande
const sendOrderConfirmationEmail = async (order) => {
  const html = orderConfirmationTemplate(order);
  return await sendEmail({
    to: order.shippingAddress.email,
    subject: `Confirmation de commande #${order._id.toString().slice(-8).toUpperCase()} - Dark Wolf Store`,
    html
  });
};

// 14. Alerte admin commande
const sendAdminNewOrderAlert = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminNewOrderAlertTemplate(order);
  return await sendEmail({
    to: adminEmail,
    subject: `[Store DWT] Nouvelle commande (${order.totalPrice.toFixed(2)} EUR)`,
    html
  });
};

// 15. Expedition commande
const sendOrderShippedEmail = async (order) => {
  const html = orderShippedTemplate(order);
  return await sendEmail({
    to: order.shippingAddress.email,
    subject: `Votre commande DWT #${order._id.toString().slice(-8).toUpperCase()} a ete expediee`,
    html
  });
};

module.exports = {
  sendEmail,
  sendRecruitmentInviteEmail,
  sendApplicationSubmittedEmail,
  sendAdminApplicationAlert,
  sendTestScheduledEmail,
  sendAdminTestAppointmentEmail,
  sendTesterConvocationEmail,
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendApplicationStatusEmail,
  sendWelcomeEmail,
  sendAdminNewUserAlert,
  sendPasswordResetCodeEmail,
  sendLoginAlertEmail,
  sendNewsletterBroadcast,
  sendOrderConfirmationEmail,
  sendAdminNewOrderAlert,
  sendOrderShippedEmail
};
