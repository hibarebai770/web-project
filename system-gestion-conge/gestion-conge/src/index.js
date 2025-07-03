import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Authentification from './Authentification';
import Inscription from './Inscription';
import HomeEmploye from './HomeEmploye';
import HomeDRH from './HomeDRH';
import Layout from './Layout';
import Home from './Home';
import SoldeConge from './gestion-conge/src/SoldeConge';
import ListeCongés from './gestion-conge/src/ListeCongés';
import ModifierDemande from './gestion-conge/src/ModifierDemande';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/authentification" element={<Authentification></Authentification>} ></Route>  
    <Route path="/inscription" element={<Inscription></Inscription>} ></Route>  
    <Route path="/" element={<Layout></Layout>} ></Route>    
    <Route path="/homeemploye" element={<HomeEmploye></HomeEmploye>} ></Route>    
    <Route path="/homedrh" element={<HomeDRH></HomeDRH>} ></Route>    
    <Route path="/home" element={<Home></Home>} ></Route>    
    <Route path="/soldeconge" element={<SoldeConge></SoldeConge>} ></Route>    
    <Route path="/listeconges" element={<ListeCongés></ListeCongés>} ></Route>    
    <Route path="/modifier" element={<ModifierDemande />} />

  </Routes> 


</BrowserRouter>
);
