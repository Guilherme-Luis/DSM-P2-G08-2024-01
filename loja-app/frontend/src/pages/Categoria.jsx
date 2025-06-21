import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCarrinho } from "../services/CarrinhoContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/cart";
import { listarProdutos } from "../services/api";
import "./Categoria.css";

function Categoria() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { nomeCategoria } = useParams();
  const { adicionarItem, atualizado } = useCarrinho(); // ⬅️ pegando do contexto
  const usuarioId = localStorage.getItem("usuarioId");

  const getProdutosFiltrados = () => {
    if (!nomeCategoria) {
      return produtos.filter((p) =>
        p.nome.toLowerCase().includes(search.toLowerCase())
      );
    }
    return produtos.filter(
      (p) =>
        p.categoria?.toLowerCase() === nomeCategoria.toLowerCase() &&
        p.nome.toLowerCase().includes(search.toLowerCase())
    );
  };

  const produtosFiltrados = getProdutosFiltrados();

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await listarProdutos();
        const data = response.data;
        const adaptados = data.map((p) => ({
          ...p,
          preco: Number(p.preco),
          desc: p.descricao,
          img: p.img || "/IMG/icone/cerveja.png",
        }));
        setProdutos(adaptados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleAdicionar = async (produto) => {
    await adicionarItem(produto.id, 1, produto); // ⬅️ usa o contexto aqui
  };

  return (
    <div className="categoria-container">
      <Navbar />
      <div className="categoria-container-content">
        <div className="categoria-content">
          <aside className="sidebar">
            {[
              "Cervejas",
              "Destilados",
              "Vinhos",
              "Sem Alcool",
              "Copao",
              "complementares",
            ].map((cat) => (
              <div
                key={cat}
                className="sidebar-item"
                onClick={() => navigate(`/categoria/${cat.toLowerCase()}`)}
              >
                {cat}
              </div>
            ))}
          </aside>

          <main className="categoria-main">
            <input
              type="text"
              className="search-bar"
              placeholder="Pesquisar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <h2 className="titulo-secao">
              {nomeCategoria && typeof nomeCategoria === "string" && nomeCategoria.length > 0
                ? nomeCategoria.charAt(0).toUpperCase() + nomeCategoria.slice(1)
                : "Todos"}
            </h2>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="produtos-grid">
                {produtosFiltrados.map((p) => (
                  <div
                    key={p.id}
                    className="produto-card"
                    onClick={() => handleAdicionar(p)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAdicionar(p);
                    }}
                  >
                    <p className="produto-nome">{p.nome}</p>
                    <p className="produto-desc">{p.desc}</p>
                    <img src={p.img} alt={p.nome} className="produto-img" />
                    <p className="produto-preco">R$ {p.preco.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </main>

          <Cart usuarioId={usuarioId} atualizado={atualizado} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Categoria;
