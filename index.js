const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Importer le package cors

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors({
  origin: 'http://localhost:4200', // Autoriser uniquement les requêtes provenant de cette origine
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

app.post('/send-email', (req, res) => {
  const { from, to, subject, text } = req.body;

  if (!from || !to || !subject || !text) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires : from, to, subject, text' });
  }

  // Créer le contenu HTML de l'e-mail
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333333;">Nouveau message de contact</h2>
          <p style="color: #555555;">Vous avez reçu un nouveau message de la part de <strong>${from}</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #333333;">Détails du message :</h3>
            <p style="color: #555555;"><strong>Expéditeur :</strong> ${from}</p>
            <p style="color: #555555;"><strong>Sujet :</strong> ${subject}</p>
            <p style="color: #555555;"><strong>Message :</strong></p>
            <p style="color: #555555; white-space: pre-wrap;">${text}</p>
          </div>
          <p style="color: #777777; margin-top: 20px;">Ce message a été envoyé via le formulaire de contact de votre site web.</p>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: from, // Expéditeur
    to: to, // Destinataire
    subject: subject, // Objet de l'e-mail
    html: htmlContent, // Corps de l'e-mail en HTML
  };

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'e-mail', error: error.message });
    } else {
      console.log('E-mail envoyé avec succès :', info.response);
      return res.status(200).json({ message: 'E-mail envoyé avec succès', info: info.response });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});