const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Importer le package cors

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors({
  origin: '*', // Autoriser uniquement les requêtes provenant de cette origine
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'] // En-têtes autorisés
}));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mhamdiamenallah666@gmail.com',
    pass: 'jmes wwii epry aima', // Remplacez par votre mot de passe d'application
  },
});
//update
app.post('/send-catalogue', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const cataloguePath = path.join(__dirname, 'catalogue.pdf'); // Path to catalogue file

  // Email to the user with the catalogue PDF
  const mailOptionsUser = {
    from: 'mhamdiamenallah666@gmail.com',
    to: email,
    subject: 'Your Catalogue Request',
    html: `<p>Hello,</p>
           <p>Thank you for requesting our catalogue. Please find the catalogue attached below.</p>
           <p>Best regards,<br/>Sinerji Team</p>`,
    attachments: [{ filename: 'catalogue.pdf', path: cataloguePath }],
  };

  transporter.sendMail(mailOptionsUser, (error, info) => {
    if (error) {
      console.error('Error sending email to user:', error);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    }

    console.log('Email sent to user:', info.response);

    // Notify admin about the request
    const mailOptionsAdmin = {
      from: 'mhamdiamenallah666@gmail.com',
      to: 'mhamdiamenallah666@gmail.com',
      subject: 'New Catalogue Request',
      html: `<p>A user has requested the catalogue.</p><p>Email: ${email}</p>`,
    };

    transporter.sendMail(mailOptionsAdmin, (err, adminInfo) => {
      if (err) {
        console.error('Error notifying admin:', err);
        return res.status(500).json({ message: 'Error notifying admin', error: err.message });
      }

      console.log('Admin notified:', adminInfo.response);
      res.status(200).json({ message: 'Catalogue sent successfully' });
    });
  });
});

app.post('/send-email', (req, res) => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !subject || !text) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires : from, to, subject, text' });
  }

  // Créer le contenu HTML de l'e-mail pour le destinataire
  const htmlContent = `
  <html>
    <body style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Message</h2>
        </div>
        <!-- Content -->
        <div style="padding: 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.5;">You have received a new message from <strong>${from}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #111827; font-size: 18px; margin-bottom: 12px;">Message Details</h3>
            <p style="color: #4b5563; margin: 8px 0;"><strong>From:</strong> ${from}</p>
            <p style="color: #4b5563; margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #4b5563; margin: 8px 0;"><strong>Message:</strong></p>
            <p style="color: #4b5563; white-space: pre-wrap; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${text}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This message was sent via the contact form on your website.</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} Sinerji. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
  `;

  // Options pour l'e-mail au destinataire
  const mailOptionsToRecipient = {
    from: from, // Expéditeur
    to: to, // Destinataire
    subject: subject, // Objet de l'e-mail
    html: htmlContent, // Corps de l'e-mail en HTML
  };

  // Envoyer l'e-mail au destinataire
  transporter.sendMail(mailOptionsToRecipient, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail au destinataire :', error);
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail', error: error.message });
    } else {
      console.log('E-mail envoyé avec succès au destinataire :', info.response);

      // Créer le contenu HTML de l'e-mail de confirmation à l'expéditeur
      const confirmationHtmlContent = `
      <html>
        <body style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #10b981; padding: 20px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Message Received</h2>
            </div>
            <!-- Content -->
            <div style="padding: 20px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">Hello,</p>
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">We have received your message and will get back to you as soon as possible.</p>
              <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 20px;">
                <h3 style="color: #111827; font-size: 18px; margin-bottom: 12px;">Your Message Summary</h3>
                <p style="color: #4b5563; margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #4b5563; margin: 8px 0;"><strong>Message:</strong></p>
                <p style="color: #4b5563; white-space: pre-wrap; background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${text}</p>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Thank you for reaching out to us. We appreciate your interest!</p>
            </div>
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} Sinerji. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
      `;
      // Options pour l'e-mail de confirmation à l'expéditeur
      const mailOptionsToSender = {
        from: to, // Expéditeur (votre adresse e-mail)
        to: from, // Destinataire (l'expéditeur du formulaire)
        subject: 'Confirmation de réception de votre message', // Objet de l'e-mail
        html: confirmationHtmlContent, // Corps de l'e-mail en HTML
      };

      // Envoyer l'e-mail de confirmation à l'expéditeur
      transporter.sendMail(mailOptionsToSender, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
          return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail de confirmation', error: error.message });
        } else {
          console.log('E-mail de confirmation envoyé avec succès à l\'expéditeur :', info.response);
          return res.status(200).json({ message: 'E-mail envoyé avec succès', info: info.response });
        }
      });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});