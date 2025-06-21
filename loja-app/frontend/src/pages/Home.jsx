import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Carousel from "../components/carousel";
import { Link } from "react-router-dom";
import './PaginaHome.css';

import cervejaImg from "../assets/paisagem/cardCervejas.png";
import destiladosIMG from "../assets/paisagem/cardDestilados.png";
import vinhosIMG from "../assets/paisagem/cardVinhos.jpg";

const PaginaHome = () => {
  const toggleMenu = () => {
    const menu = document.querySelector(".menu");
    menu.classList.toggle("active");
  };

  return (
    <div className="pagina-home">
      <Navbar />
      <div className="conteudo-principal">
        <div className="container">
          <br />
          <div className="conteudo-central">
            <div className="carrossel-area">
              <div className="carrossel-wrapper">
                <Carousel />
              </div>

              <div className="cardapio">
                <p className="cardapio-titulo">Cardápio</p>
                
                <input
                  placeholder="Pesquisa"
                  type="text"
                  className="input-pesquisa"
                />

                <div className="linha-cards">
                  <Link to="/categoria/cervejas" className="card-link">
                    <p className="card-titulo">Cervejas</p>
                    <div className="imagem-wrapper">
                      <img src={cervejaImg} alt="Cervejas" className="card-imagem" />
                    </div>
                  </Link>

                  <Link to="/categoria/destilados" className="card-link">
                    <p className="card-titulo">Destilados</p>
                    <div className="imagem-wrapper">
                      <img src={destiladosIMG} alt="Destilados" className="card-imagem" />
                    </div>
                  </Link>

                  <Link to="/categoria/vinhos" className="card-link">
                    <p className="card-titulo">Vinhos</p>
                    <div className="imagem-wrapper">
                      <img src={vinhosIMG} alt="Vinhos" className="card-imagem" />
                    </div>
                  </Link>
                </div>

                <div className="linha-cards">
                  <Link to="/categoria/sem%20alcool" className="card-link">
                    <p className="card-titulo">Sem Álcool</p>
                    <div className="imagem-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
                        alt="Sem Álcool"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/drinks" className="card-link">
                    <p className="card-titulo">Drinks</p>
                    <div className="imagem-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1514361892635-cebb9b6b9d14?auto=format&fit=crop&w=400&q=80"
                        alt="Drinks"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/complementares" className="card-link">
                    <p className="card-titulo">Complementares</p>
                    <div className="imagem-wrapper">
                      <img
                        src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80"
                        alt="Petiscos"
                        className="card-imagem"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaginaHome;
