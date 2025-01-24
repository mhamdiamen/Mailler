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

  const mailOptions = {
    from: from, // Expéditeur
    subject: subject, // Objet de l'e-mail
    text: text, // Corps de l'e-mail
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