const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validator = require("validator");

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/systemconge", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const utilisateurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  role: String,
  email: { type: String, unique: true },
  password: String,
  nb_conge: { type: Number, default: 30 }
});

const demandeCongeSchema = new mongoose.Schema({
  type: String,
  date_debut: Date,
  date_fin: Date,
  motif: String,
});

const listeDemandeSchema = new mongoose.Schema({
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur" },
  id_demandeconge: { type: mongoose.Schema.Types.ObjectId, ref: "DemandeConge" },
  confirmation: { type: Number, default: 0 },
});

// Models
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);
const DemandeConge = mongoose.model("DemandeConge", demandeCongeSchema);
const ListeDemande = mongoose.model("ListeDemande", listeDemandeSchema);

// Routes

// Create User
app.post("/add", async (req, res) => {
  const { nom, prenom, role, email, password } = req.body;
  if (!nom || !prenom || !role || !email || !password)
    return res.status(400).json({ message: "Champs manquants" });
  if (!validator.isEmail(email))
    return res.status(400).json({ message: "Email invalide" });

  try {
    const user = new Utilisateur({ nom, prenom, role, email, password });
    await user.save();
    res.json({ message: "✅ Utilisateur ajouté avec succès", id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Submit Leave Request
app.post("/demande", async (req, res) => {
  const { email, type, date_debut, date_fin, motif } = req.body;
  if (!email || !type || !date_debut || !date_fin || !motif)
    return res.status(400).json({ message: "Champs manquants" });
  if (!validator.isEmail(email))
    return res.status(400).json({ message: "Email invalide" });

  try {
    const user = await Utilisateur.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const demande = new DemandeConge({ type, date_debut, date_fin, motif });
    await demande.save();

    const liste = new ListeDemande({
      id_utilisateur: user._id,
      id_demandeconge: demande._id,
      confirmation: 0,
    });
    await liste.save();

    res.json({ message: "✅ Demande envoyée avec succès", id_demande: demande._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Champs manquants" });

  try {
    const user = await Utilisateur.findOne({ email, password });
    if (!user)
      return res.json({ success: false, message: "Identifiants incorrects" });

    res.json({
      success: true,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

// List Demandes
app.get("/liste", async (req, res) => {
  try {
    const demandes = await ListeDemande.find()
      .populate("id_utilisateur", "email")
      .populate("id_demandeconge", "type date_debut date_fin motif");
    res.json(demandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Delete Demande
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await ListeDemande.deleteMany({ id_demandeconge: id });
    const result = await DemandeConge.findByIdAndDelete(id);
    if (!result)
      return res.status(404).json({ message: "Demande non trouvée" });

    res.json({ success: true, message: "Demande supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Modify Demande
app.put("/validate/:id", async (req, res) => {
  const { confirmation } = req.body;
  const { id } = req.params;
  if (confirmation === undefined || !Number.isInteger(confirmation)) {
    return res.status(400).json({ success: false, message: "Confirmation invalide" });
  }

  try {
    const updated = await ListeDemande.updateMany(
      { id_demandeconge: id },
      { $set: { confirmation } }
    );
    if (!updated.modifiedCount) {
      return res.status(404).json({ success: false, message: "Demande non trouvée" });
    }
    res.json({ success: true, message: "✅ Demande mise à jour avec succès" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
});

// Get Solde Congé
app.get("/getsolde", async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(400).json({ message: "Email manquant" });

  try {
    const solde = await Utilisateur.findOne({ email }, 'nb_conge');
    if (!solde)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(solde);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Start server
app.listen(5003, () => {
  console.log("🚀 Serveur démarré sur http://localhost:5003");
});
