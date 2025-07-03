import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import './layout.css';
import { useNavigate } from 'react-router-dom';

export default function ListeCongés() {
  const [listeDemandes, setListeDemandes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/liste")
      .then(response => {
        setListeDemandes(response.data);
      })
      .catch(error => {
        console.error("❌ Erreur lors du chargement :", error);
        setMessage(`❌ Erreur lors du chargement des demandes : ${error.response?.data?.message || error.message}`);
      });
  }, []);

  const supprimer = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then((response) => {
        setMessage('✅ Demande refusée avec succès');
        setListeDemandes((prev) => prev.filter((item) => item.DemandeConge.id !== id));
      })
      .catch((error) => {
        console.error("❌ Erreur lors du refus :", error);
        setMessage(`❌ Erreur lors du refus : ${error.response?.data?.message || error.message}`);
      });
  };

  const valider = (id) => {
    axios.put(`http://localhost:3001/validate/${id}`, { confirmation: 1 })
      .then(() => {
        setMessage('✅ Demande validée avec succès');
        setListeDemandes((prev) =>
          prev.map((item) =>
            item.DemandeConge.id === id ? { ...item, confirmation: 1 } : item
          )
        );
      })
      .catch((error) => {
        console.error("❌ Erreur lors de la validation :", error);
        setMessage(`❌ Erreur lors de la validation : ${error.response?.data?.message || error.message}`);
      });
  };

  const modifier = (id) => {
    navigate("/modifier");
  };

  return (
    <div className="container mt-4">
      <h3>Liste des demandes de congé</h3>
      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
          {message}
        </div>
      )}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="text-primary">Email</th>
            <th className="text-primary">Type de congé</th>
            <th className="text-primary">Date de début</th>
            <th className="text-primary">Date de fin</th>
            <th className="text-primary">Motif</th>
            <th className="text-primary">Statut</th>
            <th className="text-primary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listeDemandes.length > 0 ? (
            listeDemandes.map((demande, index) => (
              <tr key={index}>
                <td>{demande.Utilisateur?.email || 'N/A'}</td>
                <td>{demande.DemandeConge?.type || 'N/A'}</td>
                <td>{demande.DemandeConge?.date_debut || 'N/A'}</td>
                <td>{demande.DemandeConge?.date_fin || 'N/A'}</td>
                <td>{demande.DemandeConge?.motif || 'N/A'}</td>
                <td>{demande.confirmation === 1 ? 'Validé' : 'En attente'}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    onClick={() => valider(demande.DemandeConge.id)}
                    disabled={demande.confirmation === 1}
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    className="btn btn-info me-2"
                    onClick={() => modifier(demande.DemandeConge.id)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => supprimer(demande.DemandeConge.id)}
                    disabled={demande.confirmation === 1}
                  >
                    Refuser
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Aucune demande trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}