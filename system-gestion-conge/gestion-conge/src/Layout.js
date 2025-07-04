import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom'; // <-- import Link
export default function Layout() {
  return (

<p > 
    <br></br>

        <Link to="/authentification" className="btn btn-primary">
        Authentification
      </Link>
      <br></br>
      <br></br>
      <Link to="/inscription" className="btn btn-primary">
        Inscription
      </Link>
      </p>
        );
}
