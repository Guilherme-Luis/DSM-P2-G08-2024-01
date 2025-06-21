import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import useAuth from "../services/AuthContext";
import {
  listarProdutos,
  excluirProduto,
  atualizarProduto,
  criarProduto,
} from "../services/api";
import ModalAdicionarProduto from "../components/ModalEstoque"; // Modal para adicionar
import ModalEditarProduto from "../components/ModaelEditarEstoque"; // Modal para editar
import "./Estoque.css";

export default function Estoque() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal adicionar
  const [showModalAdicionar, setShowModalAdicionar] = useState(false);

  // Modal editar
  const [produtoEditando, setProdutoEditando] = useState(null);

  useEffect(() => {
    if (!user || role !== "admin") {
      navigate("/login");
    }
  }, [user, role, navigate]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setLoading(true);
        const response = await listarProdutos();
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  // Abre modal de edição com o produto selecionado
  const handleEditar = (produto) => {
    setProdutoEditando(produto);
  };

  // Salva produto editado via modal
  const handleSalvarEdicao = async (produtoAtualizado) => {
    try {
      await atualizarProduto(produtoAtualizado.id || produtoEditando.id, produtoAtualizado);

      setProdutos((prev) =>
        prev.map((p) =>
          p.id === (produtoAtualizado.id || produtoEditando.id)
            ? { ...p, ...produtoAtualizado }
            : p
        )
      );

      setProdutoEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao salvar edição.");
    }
  };

  // Cancelar edição fecha modal
  const handleCancelarEdicao = () => {
    setProdutoEditando(null);
  };

  // Excluir produto
  const handleExcluir = async (id) => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmacao) return;

    try {
      await excluirProduto(id);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  };

  // Adicionar produto novo
  const handleAdicionarProduto = async (novoProduto) => {
    try {
      const response = await criarProduto(novoProduto);
      setProdutos((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto.");
    }
  };

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeValido = produto.nome
      .toLowerCase()
      .includes(filtroNome.toLowerCase());
    const statusValido =
      filtroStatus === ""
        ? true
        : filtroStatus === "emEstoque"
        ? produto.ativo === true
        : filtroStatus === "esgotado"
        ? produto.ativo === false
        : true;

    return nomeValido && statusValido;
  });

  return (
    <div className="estoque-container">
      <Navbar />

      <main className="estoque-layout">
        <aside className="estoque-tabnav">
          <button onClick={() => navigate("/Vendas")} className="tabnav-link">
            Dashboard
          </button>
          <button
            onClick={() => navigate("/estoque")}
            className="tabnav-link ativo"
          >
            Estoque
          </button>
          <button onClick={() => navigate("/pedido_adm")} className="tabnav-link">
            Pedidos
          </button>
        </aside>

        <section className="estoque-main">
          <div className="filtros-row">
            <input
              type="text"
              placeholder="Pesquisar"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="filtro-nome"
            />

            <div className="filtros-row2">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="estoque-select filtro-status"
              >
                <option value="">Todos os Status</option>
                <option value="emEstoque">Em estoque</option>
                <option value="esgotado">Esgotado</option>
              </select>

              <button
                className="estoque-btn"
                onClick={() => setShowModalAdicionar(true)}
              >
                Adicionar
              </button>
            </div>
          </div>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <table className="estoque-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Imagem</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.descricao}</td>
                    <td>{produto.categoria}</td>
                    <td>
                      {produto.img ? (
                        <img
                          src={produto.img}
                          alt={produto.nome}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#888", fontStyle: "italic" }}>
                          Sem imagem
                        </span>
                      )}
                    </td>
                    <td>{produto.quantidade}</td>
                    <td>{`R$ ${parseFloat(produto.preco).toFixed(2)}`}</td>
                    <td>{produto.ativo ? "Em estoque" : "Esgotado"}</td>
                    <td>
                      <button onClick={() => handleEditar(produto)}>Editar</button>
                      <button onClick={() => handleExcluir(produto.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <Footer />

      {showModalAdicionar && (
        <ModalAdicionarProduto
          onClose={() => setShowModalAdicionar(false)}
          onAdd={handleAdicionarProduto}
        />
      )}

      {produtoEditando && (
        <ModalEditarProduto
          produto={produtoEditando}
          onClose={handleCancelarEdicao}
          onSave={handleSalvarEdicao}
        />
      )}
    </div>
  );
}
