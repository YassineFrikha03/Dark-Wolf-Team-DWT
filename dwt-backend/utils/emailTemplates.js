/**
 * Templates HTML pour les emails de la Dark Wolf Team (DWT)
 * Design moderne, sobre, sombre et esport gaming
 * Contrainte stricte : ZERO emojis dans les templates et les sujets
 */

const baseEmailWrapper = (title, content) => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #07080c;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
        color: #cbd5e1;
      }
      .wrapper {
        width: 100%;
        background-color: #07080c;
        padding: 30px 10px;
        box-sizing: border-box;
      }
      .container {
        max-width: 620px;
        margin: 0 auto;
        background: linear-gradient(180deg, #0e121e 0%, #080a11 100%);
        border: 1px solid #1e293b;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.8);
      }
      .header {
        background: linear-gradient(90deg, #150505 0%, #200808 50%, #150505 100%);
        padding: 28px 24px;
        text-align: center;
        border-bottom: 2px solid #cc2222;
      }
      .brand-title {
        margin: 0;
        font-size: 24px;
        font-weight: 800;
        letter-spacing: 3px;
        color: #ffffff;
        text-transform: uppercase;
      }
      .brand-subtitle {
        color: #ff4d4d;
        font-size: 11px;
        letter-spacing: 4px;
        margin-top: 6px;
        text-transform: uppercase;
        font-weight: 700;
      }
      .content {
        padding: 36px 30px;
        line-height: 1.65;
        color: #cbd5e1;
        font-size: 14px;
      }
      .content h2 {
        color: #ffffff;
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 16px;
        letter-spacing: 0.5px;
      }
      .content p {
        margin: 0 0 16px 0;
      }
      .info-box {
        background-color: #121826;
        border-left: 4px solid #cc2222;
        padding: 16px 18px;
        border-radius: 0 8px 8px 0;
        margin: 22px 0;
      }
      .info-box-success {
        background-color: #0d1e18;
        border-left: 4px solid #22c55e;
        padding: 16px 18px;
        border-radius: 0 8px 8px 0;
        margin: 22px 0;
      }
      .info-box-blue {
        background-color: #0e1a2b;
        border-left: 4px solid #0284c7;
        padding: 16px 18px;
        border-radius: 0 8px 8px 0;
        margin: 22px 0;
      }
      .credentials-box {
        background: #080c14;
        border: 1px solid #1e293b;
        border-radius: 8px;
        padding: 18px;
        margin: 22px 0;
      }
      .cred-row {
        margin: 6px 0;
        font-size: 14px;
      }
      .cred-label {
        color: #94a3b8;
        display: inline-block;
        width: 130px;
        font-weight: 600;
      }
      .cred-value {
        color: #ffffff;
        font-family: 'Consolas', 'Courier New', monospace;
        font-weight: 700;
        background: #151d2c;
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      .code-badge {
        display: inline-block;
        background: #101624;
        border: 2px dashed #cc2222;
        color: #ffffff;
        font-size: 30px;
        font-weight: 800;
        letter-spacing: 8px;
        padding: 14px 28px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
      }
      .btn-container {
        text-align: center;
        margin: 28px 0;
      }
      .btn {
        display: inline-block;
        background: #cc2222;
        border: 1px solid #e60000;
        color: #ffffff !important;
        text-decoration: none;
        padding: 13px 26px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }
      .btn-green {
        display: inline-block;
        background: #16a34a;
        border: 1px solid #22c55e;
        color: #ffffff !important;
        text-decoration: none;
        padding: 13px 26px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }
      .footer {
        padding: 22px;
        text-align: center;
        font-size: 11px;
        color: #64748b;
        background-color: #05060a;
        border-top: 1px solid #172033;
      }
      .footer p {
        margin: 4px 0;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="brand-title">DARK WOLF TEAM</div>
          <div class="brand-subtitle">Organisation Esport Professionnelle</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Dark Wolf Team. Tous droits reserves.</p>
          <p>Notification automatique du systeme DWT. Merci de ne pas repondre directement a ce message.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

// 1. Email Invitation Recrutement (quand inscription refusee car non accepte)
const recruitmentInviteTemplate = (email, recruitmentUrl) => {
  const content = `
    <h2>Acces Restreint : Inscription sur Selection</h2>
    <p>Bonjour,</p>
    <p>Vous avez tente de creer un compte membre sur la plateforme officielle de la <strong>Dark Wolf Team</strong> avec l'adresse <code>${email}</code>.</p>
    <div class="info-box">
      <p style="margin: 0; color: #ffffff; font-weight: 600;">L'inscription directe est reservee aux joueurs ayant ete retenus apres les tests de recrutement officiels de notre structure esport.</p>
    </div>
    <p>Si vous souhaitez integrer l'un de nos rosters competitifs (Valorant, CS2, League of Legends, Rocket League, Rainbow Six Siege), vous devez obligatoirement soumettre votre dossier de candidature.</p>
    <p>Une fois votre candidature deposee, le staff l'etudiera afin de planifier la date et l'heure de votre test pratique de recrutement.</p>
    <div class="btn-container">
      <a href="${recruitmentUrl}" class="btn">Remplir le Formulaire de Recrutement</a>
    </div>
    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
      Lien direct d'acces au dossier de candidature :<br>
      <a href="${recruitmentUrl}" style="color: #ff6666;">${recruitmentUrl}</a>
    </p>
  `;
  return baseEmailWrapper('Recrutement Dark Wolf Team - Dossier de Candidature', content);
};

// 2. Email Confirmation Candidature (envoye au candidat apres soumission)
const applicationSubmittedTemplate = (gamertag, game) => {
  const content = `
    <h2>Candidature Recue : Roster ${game}</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Nous vous confirmons la bonne reception de votre dossier de candidature pour rejoindre l'equipe <strong>${game}</strong> de la Dark Wolf Team.</p>
    <div class="info-box-blue">
      <p style="margin: 0;"><strong>Statut du dossier :</strong> En cours d'examen par la direction esport.</p>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #94a3b8;">Le staff esport evalue vos statistiques, votre experience et vos disponibilites.</p>
    </div>
    <p>Si votre profil est preselectionne, vous recevrez une convocation officielle par email contenant la date, l'heure et les consignes pour votre test de recrutement.</p>
    <p>Assurez-vous que votre compte Discord reste joignable.</p>
  `;
  return baseEmailWrapper(`Candidature Recue - Dark Wolf Team (${game})`, content);
};

// 3. Email Alerte Admin Nouvelle Candidature
const adminNewApplicationTemplate = (app) => {
  const content = `
    <h2>Nouvelle Candidature Joueur Recue</h2>
    <p>Un nouveau postulant vient de deposer un dossier pour integrer la meute :</p>
    <div class="info-box">
      <p style="margin: 3px 0;"><strong>Gamertag :</strong> ${app.gamertag}</p>
      <p style="margin: 3px 0;"><strong>Jeu :</strong> ${app.game}</p>
      <p style="margin: 3px 0;"><strong>Rang :</strong> ${app.rank}</p>
      <p style="margin: 3px 0;"><strong>Role prefere :</strong> ${app.rolePreference || 'Non precise'}</p>
      <p style="margin: 3px 0;"><strong>Age :</strong> ${app.age} ans</p>
      <p style="margin: 3px 0;"><strong>Email :</strong> ${app.email}</p>
      <p style="margin: 3px 0;"><strong>Discord :</strong> ${app.discordTag}</p>
      ${app.trackerUrl ? `<p style="margin: 3px 0;"><strong>Tracker / Portfolio :</strong> <a href="${app.trackerUrl}" style="color: #ff6666;">${app.trackerUrl}</a></p>` : ''}
    </div>
    <div style="background: #080c14; padding: 14px; border-radius: 6px; margin: 16px 0;">
      <strong style="color: #ffffff;">Motivation et parcours :</strong>
      <p style="margin: 6px 0 0 0; color: #cbd5e1; font-style: italic;">"${app.experience}"</p>
    </div>
    <p>Veuillez vous rendre sur l'Admin Dashboard pour evaluer cette candidature et planifier la date de son test.</p>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5190'}/admin" class="btn">Acceder au Dashboard Admin</a>
    </div>
  `;
  return baseEmailWrapper(`Nouvelle Candidature : ${app.gamertag} (${app.game})`, content);
};

// 4. Email Convocation au Test de Recrutement
const testScheduledTemplate = (gamertag, game, testDate, testTime, testLocation, notes, testRoom, discordUrl, assignedTester) => {
  const formattedDate = testDate ? new Date(testDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date confirmee';

  const roomLabel = testRoom || 'Salle de Test #01 - Alpha (Public)';
  const discordLink = discordUrl || 'https://discord.gg/darkwolfteam';
  const testerLabel = assignedTester || 'Staff Dark Wolf Team';

  const content = `
    <h2>Convocation Officielle au Test de Recrutement</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Apres analyse de votre dossier, le staff de la <strong>Dark Wolf Team</strong> a le plaisir de vous convoquer pour votre test pratique de recrutement pour le roster <strong>${game}</strong>.</p>
    <div class="info-box-blue">
      <p style="margin: 4px 0;"><strong>Date du test :</strong> ${formattedDate}</p>
      <p style="margin: 4px 0;"><strong>Heure :</strong> ${testTime || 'A determiner'}</p>
      <p style="margin: 4px 0;"><strong>Salle Discord assignee :</strong> ${roomLabel}</p>
      <p style="margin: 4px 0;"><strong>Evaluateur / Testeur :</strong> ${testerLabel}</p>
      <p style="margin: 4px 0;"><strong>Lieu / Plateforme :</strong> ${testLocation || 'Serveur Discord Vocal Dark Wolf Team'}</p>
    </div>
    <div class="btn-container">
      <a href="${discordLink}" class="btn">Rejoindre le Discord DWT</a>
    </div>
    ${notes ? `
    <div style="background: #090e18; border-left: 4px solid #38bdf8; padding: 14px; border-radius: 0 6px 6px 0; margin: 18px 0;">
      <strong style="color: #ffffff;">Consignes et instructions du staff :</strong>
      <p style="margin: 6px 0 0 0; color: #cbd5e1;">${notes}</p>
    </div>` : ''}
    <p><strong>Rappels importants pour le test :</strong></p>
    <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #cbd5e1;">
      <li>Etre connecte dans la salle vocale assignee au moins 10 minutes avant l'heure fixee.</li>
      <li>Disposer d'un micro operationnel et d'une connexion internet stable.</li>
      <li>Adopter une communication claire et un esprit d'equipe irreprochable.</li>
    </ul>
    <p>A l'issue de cette session de test, l'administration prendra sa decision definitive.</p>
  `;
  return baseEmailWrapper(`Convocation Test Recrutement DWT - ${game}`, content);
};

// 4b. Notification Agenda / Rendez-vous pour l'Administrateur
const adminTestAppointmentTemplate = (gamertag, game, testDate, testTime, testRoom, discordUrl, assignedTester, candidateEmail, candidateDiscord) => {
  const formattedDate = testDate ? new Date(testDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date planifiee';

  const roomLabel = testRoom || 'Salle de Test #01 - Alpha (Public)';
  const testerLabel = assignedTester || 'Staff Dark Wolf Team';

  const content = `
    <h2>Rendez-vous Fixe : Test de Recrutement ${game}</h2>
    <p>Bonjour Administrateur,</p>
    <p>Un rendez-vous pour un test pratique de recrutement a ete planifie dans le planning de l'equipe.</p>
    <div class="info-box-blue">
      <p style="margin: 4px 0;"><strong>Candidat :</strong> ${gamertag} (${candidateEmail})</p>
      <p style="margin: 4px 0;"><strong>Discord du candidat :</strong> ${candidateDiscord || 'Non renseigne'}</p>
      <p style="margin: 4px 0;"><strong>Jeu / Roster :</strong> ${game}</p>
      <p style="margin: 4px 0;"><strong>Date du test :</strong> ${formattedDate}</p>
      <p style="margin: 4px 0;"><strong>Heure du test :</strong> ${testTime}</p>
      <p style="margin: 4px 0;"><strong>Salle Discord reservee :</strong> ${roomLabel}</p>
      <p style="margin: 4px 0;"><strong>Evaluateur assigne :</strong> ${testerLabel}</p>
    </div>
    <div class="btn-container">
      <a href="${discordUrl || 'https://discord.gg/darkwolfteam'}" class="btn">Acceder au Serveur Discord DWT</a>
    </div>
    <p style="color: #94a3b8; font-size: 13px;">
      Cette reservation a ete enregistree. Les creneaux de la salle sont verrouilles pour eviter les doublons.
    </p>
  `;
  return baseEmailWrapper(`Agenda Test Recrutement : ${gamertag} (${game})`, content);
};

// 4c. Convocation du Membre / Testeur de l'equipe
const testerConvocationTemplate = (testerName, gamertag, game, rank, discordTag, testDate, testTime, testRoom, discordUrl, notes) => {
  const formattedDate = testDate ? new Date(testDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Date planifiee';

  const roomLabel = testRoom || 'Salle de Test #01 - Alpha (Public)';

  const content = `
    <h2>Mission Testeur : Session de Recrutement ${game}</h2>
    <p>Bonjour <strong>${testerName}</strong>,</p>
    <p>Vous avez ete assigne par la direction esport pour evaluer et faire passer le test pratique d'un candidat pour le roster <strong>${game}</strong>.</p>
    <div class="info-box-blue">
      <p style="margin: 4px 0;"><strong>Candidat a tester :</strong> ${gamertag}</p>
      <p style="margin: 4px 0;"><strong>Rang en jeu :</strong> ${rank}</p>
      <p style="margin: 4px 0;"><strong>Tag Discord candidat :</strong> ${discordTag}</p>
      <p style="margin: 4px 0;"><strong>Date de la session :</strong> ${formattedDate}</p>
      <p style="margin: 4px 0;"><strong>Heure :</strong> ${testTime}</p>
      <p style="margin: 4px 0;"><strong>Salle Discord :</strong> ${roomLabel}</p>
    </div>
    <div class="btn-container">
      <a href="${discordUrl || 'https://discord.gg/darkwolfteam'}" class="btn">Rejoindre la Salle de Test Discord</a>
    </div>
    ${notes ? `
    <div style="background: #090e18; border-left: 4px solid #38bdf8; padding: 14px; border-radius: 0 6px 6px 0; margin: 18px 0;">
      <strong style="color: #ffffff;">Instructions de l'administration :</strong>
      <p style="margin: 6px 0 0 0; color: #cbd5e1;">${notes}</p>
    </div>` : ''}
    <p><strong>Criteres d'evaluation attendus :</strong></p>
    <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #cbd5e1;">
      <li>Niveau mecanique et comprehension du jeu.</li>
      <li>Communication vocale (calls, sang-froid, positionnement).</li>
      <li>Cohesion d'equipe et respect des consignes.</li>
    </ul>
    <p>Merci de transmettre votre retour d'evaluation a l'administration des la fin de la session.</p>
  `;
  return baseEmailWrapper(`Convocation Testeur DWT : ${gamertag} (${game})`, content);
};

// 5. Email Acceptation Candidature avec Identifiants generes
const applicationAcceptedTemplate = (gamertag, game, email, generatedPassword, loginUrl) => {
  const content = `
    <h2 style="color: #4ade80;">Bienvenue dans la Meute : Candidature Retenue</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Nous avons le plaisir de vous annoncer que suite a votre test de recrutement, la direction esport a valide votre integration au sein de la <strong>Dark Wolf Team</strong> sur le roster <strong>${game}</strong>.</p>
    <div class="info-box-success">
      <p style="margin: 0; color: #ffffff; font-weight: 700;">Votre profil joueur a ete cree et votre Espace Joueur officiel est desormais actif.</p>
    </div>
    <p>Voici vos identifiants temporaires de connexion pour acceder a votre Espace Joueur :</p>
    <div class="credentials-box">
      <div class="cred-row">
        <span class="cred-label">Identifiant / Email :</span>
        <span class="cred-value">${email}</span>
      </div>
      <div class="cred-row">
        <span class="cred-label">Mot de passe :</span>
        <span class="cred-value">${generatedPassword}</span>
      </div>
      <div class="cred-row">
        <span class="cred-label">Rôle assigné :</span>
        <span class="cred-value" style="color: #4ade80;">JOUEUR OFFICIEL (ROSTER ${game.toUpperCase()})</span>
      </div>
    </div>
    <div class="btn-container">
      <a href="${loginUrl}" class="btn-green">Connexion a l'Espace Joueur</a>
    </div>
    <p style="font-size: 12px; color: #94a3b8;">
      Pour des raisons de securite, nous vous recommandons de modifier ce mot de passe temporaire des votre premiere connexion dans les parametres de votre profil.
    </p>
    <p>Bienvenue dans l'aventure competitive Dark Wolf Team.</p>
  `;
  return baseEmailWrapper('Admission Officielle - Dark Wolf Team', content);
};

// 6. Email Refus Candidature (Remerciement et encouragements)
const applicationRejectedTemplate = (gamertag, game, feedbackMessage) => {
  const content = `
    <h2>Decision concernant votre candidature Dark Wolf Team</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Nous tenons a vous remercier chaleureusement pour votre implication lors du processus de recrutement et pour votre participation au test pour le roster <strong>${game}</strong>.</p>
    <p>Apres concertation avec le staff technique, nous sommes au regret de vous informer que nous n'avons pas retenu votre dossier pour la composition de cette saison.</p>
    ${feedbackMessage ? `
    <div class="info-box">
      <strong style="color: #ffffff;">Remarques de l'equipe technique :</strong>
      <p style="margin: 6px 0 0 0; color: #cbd5e1;">${feedbackMessage}</p>
    </div>` : ''}
    <p>Cette decision ne remet aucunement en cause votre potentiel. Le niveau d'exigence et le nombre tres restreint de places disponibles ont motive ce choix.</p>
    <p>Nous vous encourageons vivement a poursuivre vos entrainements competitifs et a postuler de nouveau lors de nos prochaines sessions de recrutement.</p>
    <p>Nous vous souhaitons le meilleur pour vos futurs defis esportifs.</p>
  `;
  return baseEmailWrapper('Information sur votre candidature Dark Wolf Team', content);
};

// 7. Statut generique
const applicationStatusUpdateTemplate = (gamertag, game, status, message) => {
  if (status === 'accepted') {
    return applicationAcceptedTemplate(gamertag, game, 'Votre email de candidature', 'Fourni separement', `${process.env.FRONTEND_URL || 'http://localhost:5190'}/login`);
  }
  return applicationRejectedTemplate(gamertag, game, message);
};

// 8. Email de Bienvenue Standard (Utilisateur cree par admin ou confirmation)
const welcomeTemplate = (gamertag) => {
  const content = `
    <h2>Bienvenue dans la Meute, ${gamertag}</h2>
    <p>Votre compte au sein de la <strong>Dark Wolf Team</strong> est actif.</p>
    <p>Vous avez desormais acces a notre plateforme esport, au suivi des matchs en direct, a la boutique officielle et a la communaute.</p>
    <div class="info-box">
      <strong>Principes fondamentaux de la Meute :</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Fair-play et respect strict en toutes circonstances.</li>
        <li>Engagement et rigueur lors des echeances competitives.</li>
        <li>Representation fidele des valeurs de la Dark Wolf Team.</li>
      </ul>
    </div>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5190'}" class="btn">Acceder au Site Officiel</a>
    </div>
  `;
  return baseEmailWrapper('Bienvenue chez Dark Wolf Team', content);
};

// 9. Email Notification Nouvel Inscrit (pour Admin)
const adminNewUserAlertTemplate = (newUser) => {
  const content = `
    <h2>Nouveau Membre Enregistre</h2>
    <p>Un utilisateur vient d'etre cree sur la plateforme :</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Gamertag :</strong> ${newUser.gamertag}</p>
      <p style="margin: 4px 0;"><strong>Email :</strong> ${newUser.email}</p>
      <p style="margin: 4px 0;"><strong>Role :</strong> ${newUser.role || 'user'}</p>
      <p style="margin: 4px 0;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
    </div>
  `;
  return baseEmailWrapper('Nouveau membre enregistre - DWT', content);
};

// 10. Email Code de Securite (Mot de passe oublie)
const passwordResetCodeTemplate = (gamertag, code, resetLink) => {
  const content = `
    <h2>Reinitialisation de votre mot de passe</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Une demande de reinitialisation de mot de passe a ete enregistree pour votre compte <strong>Dark Wolf Team</strong>.</p>
    <p>Voici votre code de securite a usage unique :</p>
    <div style="text-align: center; margin: 20px 0;">
      <div class="code-badge">${code}</div>
    </div>
    ${resetLink ? `
    <div class="btn-container">
      <a href="${resetLink}" class="btn">Reinitialiser mon mot de passe</a>
    </div>
    <p style="font-size: 11px; color: #94a3b8; text-align: center; word-break: break-all;">
      Lien direct : <a href="${resetLink}" style="color: #ff6666;">${resetLink}</a>
    </p>` : ''}
    <div class="info-box">
      <p style="margin: 0; color: #ff6666; font-size: 12px;"><strong>Important :</strong> Ce code expire dans 15 minutes. Si vous n'etes pas a l'origine de cette demande, vous pouvez ignorer ce message.</p>
    </div>
  `;
  return baseEmailWrapper('Reinitialisation de mot de passe - Dark Wolf Team', content);
};

// 11. Email Alerte Connexion
const loginAlertTemplate = (gamertag, ipAddress, userAgent) => {
  const content = `
    <h2>Nouvelle connexion detectee</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Une connexion a ete effectuee sur votre compte Dark Wolf Team :</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
      <p style="margin: 4px 0;"><strong>Adresse IP :</strong> ${ipAddress || 'Non precisee'}</p>
      <p style="margin: 4px 0;"><strong>Appareil :</strong> ${userAgent || 'Navigateur standard'}</p>
    </div>
    <p>Si vous n'etes pas a l'origine de cette connexion, modifiez immediatement votre mot de passe depuis les parametres.</p>
  `;
  return baseEmailWrapper('Alerte de connexion - Dark Wolf Team', content);
};

// 12. Newsletter Broadcast
const newsletterBroadcastTemplate = (subject, contentBody) => {
  const content = `
    <h2>${subject}</h2>
    <div style="margin: 20px 0;">
      ${contentBody}
    </div>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5190'}" class="btn">Voir sur le site officiel</a>
    </div>
  `;
  return baseEmailWrapper(subject, content);
};

// 13. Confirmation Commande Store
const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px 5px;"><strong>${item.name}</strong> ${item.size ? `(Taille: ${item.size})` : ''}</td>
        <td style="padding: 10px 5px; text-align: center;">x${item.qty}</td>
        <td style="padding: 10px 5px; text-align: right; color: #cbd5e1;">${(item.price * item.qty).toFixed(2)} EUR</td>
      </tr>
    `
    )
    .join('');

  const content = `
    <h2>Confirmation de votre commande</h2>
    <p>Bonjour <strong>${order.shippingAddress.fullName}</strong>,</p>
    <p>Votre commande <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> a ete validee avec succes sur le Dark Wolf Store.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; color: #cbd5e1; font-size: 13px;">
      <thead>
        <tr style="border-bottom: 2px solid #cc2222; text-align: left; color: #94a3b8;">
          <th style="padding: 8px 5px;">PRODUIT</th>
          <th style="padding: 8px 5px; text-align: center;">QTE</th>
          <th style="padding: 8px 5px; text-align: right;">PRIX</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <div class="info-box">
      <p style="margin: 4px 0;">Sous-total : ${order.itemsPrice.toFixed(2)} EUR</p>
      <p style="margin: 4px 0;">Livraison : ${order.shippingPrice.toFixed(2)} EUR</p>
      <p style="margin: 6px 0 0 0; font-size: 16px; color: #4ade80; font-weight: 700;">TOTAL : ${order.totalPrice.toFixed(2)} EUR</p>
    </div>
    <p><strong>Adresse de livraison :</strong><br>
    ${order.shippingAddress.address}, ${order.shippingAddress.postalCode} ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
  `;
  return baseEmailWrapper('Confirmation de commande - Dark Wolf Store', content);
};

// 14. Expedition Commande
const orderShippedTemplate = (order) => {
  const content = `
    <h2 style="color: #4ade80;">Votre commande a ete expediee</h2>
    <p>Bonjour <strong>${order.shippingAddress.fullName}</strong>,</p>
    <p>Votre commande <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> est desormais en cours d'acheminement.</p>
    <div class="info-box-blue">
      <p style="margin: 4px 0;"><strong>Transporteur :</strong> Standard Esports Express</p>
      <p style="margin: 4px 0;"><strong>Numero de suivi :</strong> <span style="font-family: monospace; font-weight: bold; color: #38bdf8;">${order.trackingNumber || 'En cours de synchronisation'}</span></p>
      <p style="margin: 4px 0;"><strong>Statut :</strong> Expediee</p>
    </div>
  `;
  return baseEmailWrapper('Expedition de votre commande - Dark Wolf Store', content);
};

// 15. Alerte Admin Commande
const adminNewOrderAlertTemplate = (order) => {
  const content = `
    <h2>Nouvelle Commande sur le Store</h2>
    <p>Une commande vient d'etre enregistree d'un montant de <strong>${order.totalPrice.toFixed(2)} EUR</strong>.</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Numero :</strong> #${order._id}</p>
      <p style="margin: 4px 0;"><strong>Client :</strong> ${order.shippingAddress.fullName} (${order.shippingAddress.email})</p>
      <p style="margin: 4px 0;"><strong>Articles :</strong> ${order.orderItems.length} article(s)</p>
      <p style="margin: 4px 0;"><strong>Paiement :</strong> ${order.paymentMethod}</p>
    </div>
  `;
  return baseEmailWrapper('Nouvelle commande - Dark Wolf Store', content);
};

module.exports = {
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
};
