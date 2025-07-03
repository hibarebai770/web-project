import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from "react-router-dom";
import './layout.css'
const Inscription = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (role !== "employe" && role !== "DRH") {
      setMessage("❗ Le rôle doit être 'employe' ou 'DRH'");
      <Link to="/home" className="btn btn-primary"></Link>
    }

    axios.post("http://localhost:3001/add", {
      nom,
      prenom,
      role,
      email,
      password
    })
      .then(() => {
        setMessage("✅ Inscription réussie !");
        setNom("");
        setPrenom("");
        setRole("");
        setEmail("");
        setPassword("");
        navigate("/home");
      })
      .catch((error) => {
        setMessage("❌ Erreur lors de l'inscription.");
        console.error("Erreur:", error);
      });
  };

  return (
    <div className="container mt-5 " style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Inscription</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">Nom</label>
          <input
            type="text"
            id="nom"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">Prénom</label>
          <input
            type="text"
            id="prenom"
            className="form-control"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rôle</label>
          <select
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">-- Sélectionnez un rôle --</option>
            <option value="employe">Employé</option>
            <option value="DRH">DRH</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Adresse Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Inscription;
