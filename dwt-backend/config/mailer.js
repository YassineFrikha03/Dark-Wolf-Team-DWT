const nodemailer = require('nodemailer');
const {
  welcomeTemplate,
  adminNewUserAlertTemplate,
  passwordResetCodeTemplate,
  loginAlertTemplate,
  applicationSubmittedTemplate,
  adminNewApplicationTemplate,
  applicationStatusUpdateTemplate,
  newsletterBroadcastTemplate
} = require('../utils/emailTemplates');

let transporter = null;

// Création du transporteur Nodemailer
const getTransporter = async () => {
  if (transporter) return transporter;

  // Si des identifiants SMTP ou Gmail sont fournis dans le .env
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    if (process.env.EMAIL_SERVICE) {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }
    console.log('📧 Service Mailer initialisé avec succès (SMTP configuré).');
    return transporter;
  }

  // Mode Dev / Démonstration : Ethereal ou Logger
  console.log('⚠️ Aucune configuration EMAIL_USER trouvée dans .env. Création d\'un compte de test Ethereal...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`📧 Mailer de test Ethereal actif : ${testAccount.user}`);
  } catch (err) {
    console.warn('Impossible de créer un compte Ethereal, mode simulateur activé :', err.message);
    transporter = {
      sendMail: async (options) => {
        console.log('📨 [EMAIL SIMULÉ] Destinataire :', options.to);
        console.log('📨 [EMAIL SIMULÉ] Sujet :', options.subject);
        return { messageId: 'simulated-' + Date.now() };
      }
    };
  }

  return transporter;
};

// Fonction générique d'envoi d'email
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const client = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Dark Wolf Team" <no-reply@darkwolfteam.gg>';

    const info = await client.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || ''
    });

    console.log(`✉️ Email envoyé à ${to} [ID: ${info.messageId || 'ok'}]`);
    
    // Si compte ethereal, afficher le lien de prévisualisation
    const previewUrl = nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null;
    if (previewUrl) {
      console.log(`🔗 Lien de prévisualisation de l'email : ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${to} :`, error.message);
    return { success: false, error: error.message };
  }
};

// 1. Envoyer email de bienvenue à l'utilisateur
const sendWelcomeEmail = async (user) => {
  const html = welcomeTemplate(user.gamertag);
  return await sendEmail({
    to: user.email,
    subject: 'Bienvenue dans la Dark Wolf Team 🐺🎮',
    html
  });
};

// 2. Notifier l'admin lors d'une nouvelle inscription
const sendAdminNewUserAlert = async (user) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminNewUserAlertTemplate(user);
  return await sendEmail({
    to: adminEmail,
    subject: `🚨 [DWT] Nouveau membre inscrit : ${user.gamertag}`,
    html
  });
};

// 3. Envoyer le code de sécurité pour mot de passe oublié
const sendPasswordResetCodeEmail = async (email, gamertag, code) => {
  const html = passwordResetCodeTemplate(gamertag, code);
  return await sendEmail({
    to: email,
    subject: `🔑 ${code} est ton code de sécurité Dark Wolf Team`,
    html,
    text: `Bonjour ${gamertag}, ton code de réinitialisation est : ${code}. Il expire dans 15 minutes.`
  });
};

// 4. Alerte de connexion (optionnelle)
const sendLoginAlertEmail = async (user, ipAddress, userAgent) => {
  const html = loginAlertTemplate(user.gamertag, ipAddress, userAgent);
  return await sendEmail({
    to: user.email,
    subject: '🛡️ Nouvelle connexion détectée à votre compte Dark Wolf Team',
    html
  });
};

// 5. Confirmation de candidature envoyée au joueur
const sendApplicationSubmittedEmail = async (application) => {
  const html = applicationSubmittedTemplate(application.gamertag, application.game);
  return await sendEmail({
    to: application.email,
    subject: `🐺 Candidature DWT reçue (${application.game})`,
    html
  });
};

// 6. Alerte à l'admin pour nouvelle candidature
const sendAdminApplicationAlert = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const html = adminNewApplicationTemplate(application);
  return await sendEmail({
    to: adminEmail,
    subject: `🎯 [Recrutement DWT] Nouvelle candidature de ${application.gamertag} (${application.game})`,
    html
  });
};

// 7. Statut de candidature (Accepté / Refusé)
const sendApplicationStatusEmail = async (application, customMessage) => {
  const html = applicationStatusUpdateTemplate(
    application.gamertag,
    application.game,
    application.status,
    customMessage
  );
  const statusLabel = application.status === 'accepted' ? 'Acceptée ! 🎉' : 'Mise à jour';
  return await sendEmail({
    to: application.email,
    subject: `🐺 Ta candidature Dark Wolf Team : ${statusLabel}`,
    html
  });
};

// 8. Envoi de newsletter ou d'annonces
const sendNewsletterBroadcast = async (recipients, subject, content) => {
  if (!recipients || recipients.length === 0) return;
  const html = newsletterBroadcastTemplate(subject, content);
  
  // Envoi à la liste (Bcc pour la confidentialité)
  const toList = recipients.join(', ');
  return await sendEmail({
    to: toList,
    subject: `🐺 [Dark Wolf Team] ${subject}`,
    html
  });
};

// 9. Envoi de confirmation de commande au client
const sendOrderConfirmationEmail = async (order) => {
  const { orderConfirmationTemplate } = require('../utils/emailTemplates');
  const html = orderConfirmationTemplate(order);
  return await sendEmail({
    to: order.shippingAddress.email,
    subject: `🐺 Confirmation de votre commande #${order._id.toString().slice(-8).toUpperCase()} - Dark Wolf Store`,
    html
  });
};

// 10. Alerte admin lors d'une nouvelle commande passée
const sendAdminNewOrderAlert = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) return;

  const { adminNewOrderAlertTemplate } = require('../utils/emailTemplates');
  const html = adminNewOrderAlertTemplate(order);
  return await sendEmail({
    to: adminEmail,
    subject: `💰 [Store DWT] Nouvelle commande de ${order.totalPrice.toFixed(2)} € (#${order._id.toString().slice(-8).toUpperCase()})`,
    html
  });
};

// 11. Notification d'expédition de commande avec numéro de suivi
const sendOrderShippedEmail = async (order) => {
  const { orderShippedTemplate } = require('../utils/emailTemplates');
  const html = orderShippedTemplate(order);
  return await sendEmail({
    to: order.shippingAddress.email,
    subject: `📦 Votre commande DWT #${order._id.toString().slice(-8).toUpperCase()} a été expédiée !`,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendAdminNewUserAlert,
  sendPasswordResetCodeEmail,
  sendLoginAlertEmail,
  sendApplicationSubmittedEmail,
  sendAdminApplicationAlert,
  sendApplicationStatusEmail,
  sendNewsletterBroadcast,
  sendOrderConfirmationEmail,
  sendAdminNewOrderAlert,
  sendOrderShippedEmail
};
