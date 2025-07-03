import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import './layout.css'

export default function Home() {
  return (

<p> 
    <br></br>
        <Link to="/homeemploye" className="btn btn-primary">
        demande congé
      </Link>
      <br></br>
      <br></br>
      <Link to="/soldeconge" className="btn btn-primary">
      solde de congés
      </Link>
      </p>
        );
}
