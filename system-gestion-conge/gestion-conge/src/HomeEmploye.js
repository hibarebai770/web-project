import 'bootstrap/dist/css/bootstrap.css';
import './layout.css';
import { useState } from 'react';
import axios from 'axios';

export default function HomeEmploye() {
  const today = new Date().toISOString().split("T")[0];

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [motif, setMotif] = useState("");
  const [date_debut, setDateDebut] = useState(today);
  const [date_fin, setDateFin] = useState(today);
  const [loading, setLoading] = useState(false);

  const envoyer = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Validate dates
      if (new Date(date_debut) > new Date(date_fin)) {
        setMessage("❌ La date de début ne peut pas être après la date de fin.");
        setLoading(false);
        return;
      }
      if (!type) {
        setMessage("❌ Veuillez sélectionner un type de congé.");
        setLoading(false);
        return;
      }

      const resp = await axios.post("http://localhost:3001/demande", {
        email,
        type,
        date_debut,
        date_fin,
        motif,
      });

      console.log("Response:", resp.data);
      setMessage("✅ Demande envoyée avec succès");
      // Reset form
      setEmail("");
      setType("");
      setMotif("");
      setDateDebut(today);
      setDateFin(today);
    } catch (err) {
      console.error("Erreur dans envoyer():", err.response?.data || err);
      const errorMsg = err.response?.data?.message || "Une erreur est survenue.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    envoyer();
  };

  return (
    <div className="container mt-4">
      <div>Demande de congé</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Entrez votre email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type de congé</label>
          <select
            className="form-select"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Sélectionnez le type de congé</option>
            <option value="conge exceptionnel">Congé exceptionnel</option>
            <option value="conge maladie">Congé maladie</option>
            <option value="conge annuel">Congé annuel</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="date_debut" className="form-label">Date de début</label>
          <input
            type="date"
            className="form-control"
            id="date_debut"
            value={date_debut}
            onChange={(e) => setDateDebut(e.target.value)}
            min={today}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="date_fin" className="form-label">Date de fin</label>
          <input
            type="date"
            className="form-control"
            id="date_fin"
            value={date_fin}
            onChange={(e) => setDateFin(e.target.value)}
            min={date_debut || today}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="motif" className="form-label">Motif</label>
          <textarea
            className="form-control"
            id="motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows="4"
            placeholder="Entrez la raison du congé"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
        </button>

        {message && (
          <div className={`mt-3 alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
} 