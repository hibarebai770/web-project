import 'bootstrap/dist/css/bootstrap.css';
import './layout.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ModifierDemande() {
  const { id } = useParams(); // ✅ Get the id from URL
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [date_debut, setDateDebut] = useState(today);
  const [date_fin, setDateFin] = useState(today);
  const [motif, setMotif] = useState("");

  const modifier = (id) => {
    axios.put(`http://localhost:3001/modifier/${id}`, {
      type: type,
      date_debut: date_debut,
      date_fin: date_fin,
      motif: motif
    })
    .then(() => {
      window.alert("Demande modifiée avec succès !");
      setType("");
      setDateDebut(today);
      setDateFin(today);
      setMotif("");
      navigate('/listeconges'); 
    })
    .catch((error) => {
      console.error("Erreur:", error);
    });
  };

  return (
    <form>
      <p>Modifier la demande </p>      
      <div className="mb-3">
        <select
          id="role"
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">-- Sélectionnez le type de congé --</option>
          <option value="conge exceptionnel">congé exceptionnel</option>
          <option value="conge maladie">congé maladie</option>
          <option value="conge annuel">congé annuel</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Modifier Date début</label>
        <input
          type="date"
          className="form-control"
          value={date_debut}
          onChange={(e) => setDateDebut(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Modifier Date fin</label>
        <input
          type="date"
          className="form-control"
          value={date_fin}
          onChange={(e) => setDateFin(e.target.value)}
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
          placeholder="Modifier la raison du congé"
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        onClick={(e) => {
          e.preventDefault();
          modifier(id); 
        }}
      >
        Submit
      </button>
    </form>
  );
}
