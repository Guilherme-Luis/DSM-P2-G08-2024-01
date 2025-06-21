import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Carousel from "../components/carousel";

import "./PaginaHome.css";

import destiladosIMG from "../assets/paisagem/d.jpg";
import vinhosIMG from "../assets/paisagem/v.jpg";
import cervejaImg from "../assets/paisagem/c.jpg";
import semalcoImg from "../assets/paisagem/s.jpg";
import drinkIMG from "../assets/paisagem/d.png";
import petiscosIMG from "../assets/paisagem/p.jpg";

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
                  type="text"
                  placeholder="Pesquisa"
                  className="input-pesquisa"
                />

                {/* Primeira linha de categorias */}
                <div className="linha-cards">
                  <Link to="/categoria/cervejas" className="card-link">
                    <p className="card-titulo">Cervejas</p>
                    <div className="imagem-wrapper">
                      <img
                        src={cervejaImg}
                        alt="Cervejas"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/destilados" className="card-link">
                    <p className="card-titulo">Destilados</p>
                    <div className="imagem-wrapper">
                      <img
                        src={destiladosIMG}
                        alt="Destilados"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/vinhos" className="card-link">
                    <p className="card-titulo">Vinhos</p>
                    <div className="imagem-wrapper">
                      <img
                        src={vinhosIMG}
                        alt="Vinhos"
                        className="card-imagem"
                      />
                    </div>
                  </Link>
                </div>

                {/* Segunda linha de categorias */}
                <div className="linha-cards">
                  <Link to="/categoria/sem%20alcool" className="card-link">
                    <p className="card-titulo">Sem Álcool</p>
                    <div className="imagem-wrapper">
                      <img
                        src={semalcoImg}
                        alt="Sem Álcool"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/drinks" className="card-link">
                    <p className="card-titulo">Drinks</p>
                    <div className="imagem-wrapper">
                      <img
                        src={drinkIMG}
                        alt="Drinks"
                        className="card-imagem"
                      />
                    </div>
                  </Link>

                  <Link to="/categoria/complementares" className="card-link">
                    <p className="card-titulo">Complementares</p>
                    <div className="imagem-wrapper">
                      <img
                        src={petiscosIMG}
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
