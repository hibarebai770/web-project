import 'bootstrap/dist/css/bootstrap.css';
import './layout.css';
import { useState } from 'react';
import axios from 'axios'; // tu avais oublié l'import axios

export default function SoldeConge() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [solde, setSolde] = useState(0);

  const envoyer = (e) => {
    e.preventDefault();

    axios.get("http://localhost:3001/getsolde", {
      params: { email }
    })
      .then((response) => {
        setSolde(response.data.nb_conge);
        setEmail("");
        setMessage(" Votre solde de congé est :");
      })
      .catch((error) => {
        setMessage("❌ Erreur lors de la récupération du solde.");
        console.error("Erreur:", error);
      });
  };

  return (
    <form onSubmit={envoyer} className="p-4">
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

      <button type="submit" className="btn btn-primary">Vérifier Solde</button>

      <div className="mt-3">
        {message && <div>{message} {solde}</div>}
      </div>
    </form>
  );
}
