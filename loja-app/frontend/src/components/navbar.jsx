import React from 'react';
import './navbar.css';
import logo from '../assets/logo/copocheio.png';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import UserDropdown from "../components/UserDropdown";

const Navbar = () => {
  return (
    <header className="navbar ">
      <div className='navbar-container'>
        <div className="logo-area">
        <img src= { logo } alt="logo" className="logo" />
        <h1>COPO CHEIO APP</h1>
      </div>

      <nav className="menu">
        <Link to="/Home">Cardápio</Link>
        <Link to="/categoria">Categorias</Link>
        <Link to="/pedidos">Pedidos</Link>
        <a href="#">Promoções</a>
        <Link to="/sobrenos">Empresa</Link>
        <UserDropdown user={{ nome: "Seu Nome", email: "seu@email.com" }} />
      </nav>


      </div>

    </header>
  );
};

export default Navbar;