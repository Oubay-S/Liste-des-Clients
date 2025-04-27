const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Import du package CORS
const Client = require("./models/Client");

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Autoriser les requêtes Cross-Origin
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Middleware pour servir les fichiers statiques dans le dossier "public"
app.use(express.static('public'));

// Connexion à MongoDB
mongoose
  .connect("mongodb://admin:1234@localhost:27017/Clientdb?authSource=admin")
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Route : Ajouter un client
app.post("/clients", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route : Lister tous les clients
app.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route : Obtenir un client par id
app.get("/clients/:id", async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/clients/:id", async (req, res) => {
    try {
      const client = await Client.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!client) return res.status(404).json({ message: "Client non trouvé" });
      res.json(client);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

app.delete("/clients/:id", async (req, res) => {
    try {
      const client = await Client.findOneAndDelete({ id: req.params.id });
      if (!client) return res.status(404).json({ message: "Client non trouvé" });
      res.json({ message: "Client supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
