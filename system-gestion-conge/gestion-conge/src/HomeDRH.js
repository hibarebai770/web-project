import 'bootstrap/dist/css/bootstrap.css';
import './layout.css'
import { Link } from 'react-router-dom';

export default function HomeDRH() {
  return (

<p> 
    <br></br>
      
      <Link to="/listeconges" className="btn btn-primary">
 voir les demandes de congés      </Link>
      </p>
        );
}
