import { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import { useNavigate } from "react-router-dom";
import './layout.css'
const Authentification = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/login", {
      email,
      password
    })
    .then((response) => {
      const { success, role } = response.data;

      if (success) {
        setMessage("✅ Connexion réussie !");
        localStorage.setItem("userRole", role);

        switch (role) {
          case "employe":
            navigate("/home");
            break;
          case "DRH":
            navigate("/homedrh");
            break;
          default:
            navigate("/home"); 
        }
      } else {
        setMessage("❌ Email ou mot de passe incorrect.");
      }
    })
    .catch((error) => {
      setMessage("❌ Erreur lors de la connexion.");
      console.error("Erreur:", error);
    });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Connexion</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
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
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Authentification;
