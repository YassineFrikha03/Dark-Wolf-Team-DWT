/**
 * Templates HTML pour les emails de la Dark Wolf Team (DWT)
 * Design moderne, sombre & esport gaming
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
        background-color: #0d0f17;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #e2e8f0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: linear-gradient(145deg, #131722 0%, #0b0e14 100%);
        border: 1px solid #1e293b;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
      }
      .header {
        background: linear-gradient(90deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
        padding: 30px 20px;
        text-align: center;
        border-bottom: 2px solid #6366f1;
      }
      .logo-title {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 2px;
        color: #ffffff;
        text-transform: uppercase;
      }
      .logo-tag {
        color: #a5b4fc;
        font-size: 13px;
        letter-spacing: 3px;
        margin-top: 5px;
        text-transform: uppercase;
      }
      .content {
        padding: 35px 30px;
        line-height: 1.6;
        color: #cbd5e1;
      }
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #64748b;
        background-color: #07090e;
        border-top: 1px solid #1e293b;
      }
      .code-badge {
        display: inline-block;
        background: #1e1b4b;
        border: 2px dashed #6366f1;
        color: #a5b4fc;
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 8px;
        padding: 15px 30px;
        border-radius: 12px;
        margin: 25px 0;
        text-align: center;
      }
      .btn {
        display: inline-block;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: #ffffff !important;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 20px;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
      }
      .info-box {
        background-color: #1a1e2e;
        border-left: 4px solid #6366f1;
        padding: 15px;
        border-radius: 0 8px 8px 0;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 class="logo-title">🐺 DARK WOLF TEAM</h1>
        <div class="logo-tag">Esports Gaming Community</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Dark Wolf Team. Tous droits réservés.</p>
        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// 1. Email de Bienvenue (Sign up)
const welcomeTemplate = (gamertag) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Bienvenue dans la Meute, ${gamertag} ! 🎮</h2>
    <p>Ton compte au sein de la <strong>Dark Wolf Team</strong> a été créé avec succès.</p>
    <p>Tu as désormais accès à notre communauté esport, aux annonces exclusives, au suivi des matchs en direct et aux candidatures pour nos rosters compétitifs.</p>
    <div class="info-box">
      <strong>Règles de la Meute :</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Fair-play et respect mutuel en toutes circonstances.</li>
        <li>Engagement lors des entraînements et des compétitions.</li>
        <li>Représente fièrement les couleurs de DWT !</li>
      </ul>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">Accéder au site officiel</a>
    </div>
  `;
  return baseEmailWrapper('Bienvenue chez Dark Wolf Team', content);
};

// 2. Email Notification Nouvel Inscrit (pour Admin)
const adminNewUserAlertTemplate = (newUser) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">🚨 Nouveau Membre Enregistré</h2>
    <p>Un nouvel utilisateur vient de rejoindre la plateforme <strong>Dark Wolf Team</strong> :</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Gamertag :</strong> ${newUser.gamertag}</p>
      <p style="margin: 4px 0;"><strong>Email :</strong> ${newUser.email}</p>
      <p style="margin: 4px 0;"><strong>Rôle :</strong> ${newUser.role || 'user'}</p>
      <p style="margin: 4px 0;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
    </div>
  `;
  return baseEmailWrapper('Nouveau membre inscrit', content);
};

// 3. Email Code de Sécurité (Mot de passe oublié)
const passwordResetCodeTemplate = (gamertag, code) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Réinitialisation de ton mot de passe 🔒</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour ton compte Dark Wolf Team.</p>
    <p>Voici ton <strong>code de sécurité temporaire</strong> :</p>
    <div style="text-align: center;">
      <div class="code-badge">${code}</div>
    </div>
    <div class="info-box">
      <p style="margin: 0; color: #f87171;">⚠️ <strong>Attention :</strong> Ce code expire dans <strong>15 minutes</strong>.</p>
      <p style="margin: 6px 0 0 0;">Si tu n'es pas à l'origine de cette demande, ignore simplement cet email, ton compte reste sécurisé.</p>
    </div>
  `;
  return baseEmailWrapper('Code de sécurité - Dark Wolf Team', content);
};

// 4. Email Notification de Connexion (Login Alert)
const loginAlertTemplate = (gamertag, ipAddress, userAgent) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Nouvelle connexion détectée 🛡️</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Une connexion à ton compte Dark Wolf Team vient d'avoir lieu :</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
      <p style="margin: 4px 0;"><strong>Adresse IP :</strong> ${ipAddress || 'Inconnue'}</p>
      <p style="margin: 4px 0;"><strong>Appareil :</strong> ${userAgent || 'Navigateur standard'}</p>
    </div>
    <p>Si c'était toi, aucune action n'est requise. Si ce n'était pas toi, change immédiatement ton mot de passe !</p>
  `;
  return baseEmailWrapper('Alerte de connexion - Dark Wolf Team', content);
};

// 5. Email Confirmation Candidature (Pour le joueur)
const applicationSubmittedTemplate = (gamertag, game) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Candidature Reçue ! 🏆</h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    <p>Nous confirmons la bonne réception de ta candidature pour rejoindre le roster <strong>${game}</strong> de la Dark Wolf Team.</p>
    <div class="info-box">
      <p style="margin: 0;">Notre staff esport examine actuellement ton profil et tes performances. Tu recevras une réponse très prochainement par email ou sur Discord.</p>
    </div>
    <p>Prépare tes clips et tiens-toi prêt pour d'éventuels tryouts !</p>
  `;
  return baseEmailWrapper('Candidature Dark Wolf Team reçue', content);
};

// 6. Email Alerte Admin Nouvelle Candidature
const adminNewApplicationTemplate = (app) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">🎯 Nouvelle Candidature Reçue</h2>
    <p>Un joueur postule pour rejoindre l'équipe :</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Gamertag :</strong> ${app.gamertag}</p>
      <p style="margin: 4px 0;"><strong>Jeu :</strong> ${app.game}</p>
      <p style="margin: 4px 0;"><strong>Rang :</strong> ${app.rank}</p>
      <p style="margin: 4px 0;"><strong>Discord :</strong> ${app.discordTag}</p>
      <p style="margin: 4px 0;"><strong>Âge :</strong> ${app.age} ans</p>
      <p style="margin: 4px 0;"><strong>Email :</strong> ${app.email}</p>
    </div>
  `;
  return baseEmailWrapper('Nouvelle candidature de joueur DWT', content);
};

// 7. Email Statut Candidature (Acceptée ou Refusée)
const applicationStatusUpdateTemplate = (gamertag, game, status, message) => {
  const isAccepted = status === 'accepted';
  const content = `
    <h2 style="color: ${isAccepted ? '#4ade80' : '#f87171'}; margin-top: 0;">
      ${isAccepted ? 'Félicitations ! Candidature Acceptée 🐺' : 'Mise à jour concernant ta candidature'}
    </h2>
    <p>Bonjour <strong>${gamertag}</strong>,</p>
    ${isAccepted 
      ? `<p>Le staff de la <strong>Dark Wolf Team</strong> a le plaisir de t'annoncer que ta candidature pour le roster <strong>${game}</strong> a été <strong>RETENUE</strong> !</p>`
      : `<p>Nous avons étudié avec attention ta candidature pour le roster <strong>${game}</strong>. Malheureusement, nous ne pouvons donner une suite favorable pour cette session.</p>`
    }
    ${message ? `<div class="info-box"><strong>Message du Staff :</strong><p style="margin: 6px 0 0 0;">${message}</p></div>` : ''}
    ${isAccepted 
      ? `<p>Rejoins vite notre serveur Discord pour débuter ton intégration et rencontrer tes coéquipiers !</p>`
      : `<p>Continue de t'entraîner et n'hésite pas à retenter ta chance lors des prochains recrutements !</p>`
    }
  `;
  return baseEmailWrapper('Statut de candidature DWT', content);
};

// 8. Newsletter Broadcast Template
const newsletterBroadcastTemplate = (subject, contentBody) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">${subject}</h2>
    <div style="margin: 20px 0;">
      ${contentBody}
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="btn">Voir sur le site officiel</a>
    </div>
  `;
  return baseEmailWrapper(subject, content);
};

// 9. Email Confirmation de Commande Boutique (Client)
const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 10px 5px;"><strong>${item.name}</strong> ${item.size ? `(Taille: ${item.size})` : ''}</td>
        <td style="padding: 10px 5px; text-align: center;">x${item.qty}</td>
        <td style="padding: 10px 5px; text-align: right; color: #a5b4fc;">${(item.price * item.qty).toFixed(2)} €</td>
      </tr>
    `
    )
    .join('');

  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">Merci pour ta commande ! 🐺🛍️</h2>
    <p>Bonjour <strong>${order.shippingAddress.fullName}</strong>,</p>
    <p>Nous avons bien reçu ta commande <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> sur le store officiel de la Dark Wolf Team.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; color: #cbd5e1;">
      <thead>
        <tr style="border-bottom: 2px solid #6366f1; text-align: left; color: #94a3b8; font-size: 13px;">
          <th style="padding: 8px 5px;">PRODUIT</th>
          <th style="padding: 8px 5px; text-align: center;">QTÉ</th>
          <th style="padding: 8px 5px; text-align: right;">PRIX</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="info-box">
      <p style="margin: 4px 0; display: flex; justify-content: space-between;"><span>Sous-total :</span> <strong>${order.itemsPrice.toFixed(2)} €</strong></p>
      <p style="margin: 4px 0; display: flex; justify-content: space-between;"><span>Livraison :</span> <strong>${order.shippingPrice.toFixed(2)} €</strong></p>
      <hr style="border: 0; border-top: 1px solid #334155; margin: 8px 0;" />
      <p style="margin: 4px 0; font-size: 18px; color: #4ade80; display: flex; justify-content: space-between;"><span>TOTAL :</span> <strong>${order.totalPrice.toFixed(2)} €</strong></p>
    </div>

    <p><strong>Adresse de livraison :</strong><br>
    ${order.shippingAddress.address}, ${order.shippingAddress.postalCode} ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
    <p>Tu recevras un autre email avec le numéro de suivi dès que ton colis sera expédié !</p>
  `;
  return baseEmailWrapper('Confirmation de commande Dark Wolf Store', content);
};

// 10. Email Expédition de Commande (Client)
const orderShippedTemplate = (order) => {
  const content = `
    <h2 style="color: #4ade80; margin-top: 0;">Ta commande est en route ! 🚀📦</h2>
    <p>Bonjour <strong>${order.shippingAddress.fullName}</strong>,</p>
    <p>Bonne nouvelle ! Ta commande <strong>#${order._id.toString().slice(-8).toUpperCase()}</strong> vient d'être expédiée par la meute.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Transporteur :</strong> Standard Esports Express</p>
      <p style="margin: 4px 0;"><strong>Numéro de suivi :</strong> <span style="color: #a5b4fc; font-weight: bold;">${order.trackingNumber || 'En cours de synchronisation'}</span></p>
      <p style="margin: 4px 0;"><strong>Statut :</strong> Expédiée</p>
    </div>

    <p>Merci de ton soutien à la Dark Wolf Team ! Arbore fièrement nos couleurs. 🐺</p>
  `;
  return baseEmailWrapper('Commande expédiée - Dark Wolf Store', content);
};

// 11. Alerte Admin Nouvelle Commande
const adminNewOrderAlertTemplate = (order) => {
  const content = `
    <h2 style="color: #ffffff; margin-top: 0;">💰 Nouvelle Commande sur le Store !</h2>
    <p>Une commande vient d'être passée d'un montant de <strong>${order.totalPrice.toFixed(2)} €</strong>.</p>
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>N° Commande :</strong> #${order._id}</p>
      <p style="margin: 4px 0;"><strong>Client :</strong> ${order.shippingAddress.fullName} (${order.shippingAddress.email})</p>
      <p style="margin: 4px 0;"><strong>Articles :</strong> ${order.orderItems.length} article(s)</p>
      <p style="margin: 4px 0;"><strong>Total :</strong> ${order.totalPrice.toFixed(2)} €</p>
      <p style="margin: 4px 0;"><strong>Paiement :</strong> ${order.paymentMethod}</p>
    </div>
  `;
  return baseEmailWrapper('Nouvelle commande sur le Dark Wolf Store', content);
};

module.exports = {
  welcomeTemplate,
  adminNewUserAlertTemplate,
  passwordResetCodeTemplate,
  loginAlertTemplate,
  applicationSubmittedTemplate,
  adminNewApplicationTemplate,
  applicationStatusUpdateTemplate,
  newsletterBroadcastTemplate,
  orderConfirmationTemplate,
  orderShippedTemplate,
  adminNewOrderAlertTemplate
};
