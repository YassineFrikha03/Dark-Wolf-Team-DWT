const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/mailer');

// @desc    Envoyer un message de contact (partenariat, question, etc.)
// @route   POST /api/contact
// @access  Public
const submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs (nom, email, sujet, message) sont obligatoires'
      });
    }

    const contact = await Contact.create({
      name,
      email: email.toLowerCase().trim(),
      subject,
      message
    });

    // Notification interne pour le Dashboard Admin
    await Notification.create({
      recipientRole: 'admin',
      type: 'message',
      title: `📩 Message Contact : ${name}`,
      message: `[${subject}] ${message.slice(0, 60)}${message.length > 60 ? '...' : ''}`,
      metadata: {
        contactId: contact._id,
        senderName: name,
        senderEmail: email
      }
    }).catch((err) => console.error('Erreur notification contact admin :', err.message));

    // Notification à l'admin par email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      sendEmail({
        to: adminEmail,
        subject: `📩 [DWT Contact] Nouveau message de ${name} : ${subject}`,
        html: `
          <h3>Nouveau message reçu depuis le site :</h3>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <p><strong>Message :</strong></p>
          <blockquote style="background:#f1f5f9;padding:10px;border-left:4px solid #6366f1;">${message}</blockquote>
        `
      }).catch((err) => console.error('Erreur email contact admin :', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé au staff de la Dark Wolf Team ! Nous vous répondrons rapidement. 🐺',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les messages reçus
// @route   GET /api/contact
// @access  Privé (Admin)
const getMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const messages = await Contact.find(query).sort({ createdAt: -1 });
    const unreadCount = await Contact.countDocuments({ status: 'unread' });

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marquer un message comme traité ou y répondre
// @route   PUT /api/contact/:id
// @access  Privé (Admin)
const updateMessageStatus = async (req, res, next) => {
  try {
    const { status, replyNotes, replyEmailBody } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message introuvable'
      });
    }

    if (status) contact.status = status;
    if (replyNotes) contact.replyNotes = replyNotes;

    // Si l'admin a rédigé une réponse directe par email
    if (replyEmailBody) {
      contact.status = 'replied';
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject} - Réponse du staff Dark Wolf Team`,
        html: `
          <p>Bonjour ${contact.name},</p>
          <p>${replyEmailBody}</p>
          <br>
          <p>Cordialement,<br><strong>L'équipe Dark Wolf Team</strong> 🐺</p>
        `
      });
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Statut du message mis à jour avec succès',
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un message de contact
// @route   DELETE /api/contact/:id
// @access  Privé (Admin)
const deleteMessage = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message supprimé'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage
};
