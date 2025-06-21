import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../services/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import PedidoDetalhe from "../components/PedidoDetalhe";
import "./pedidoadm.css";
import { listarPedidos, atualizarPedido } from "../services/pedidos";

const PedidosAdm = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState("emAndamento");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    if (!user || role !== "admin") {
      navigate("/login");
    }
  }, [user, role, navigate]);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      try {
        const data = await listarPedidos();
        setPedidos(data);
      } catch (err) {
        alert("Erro ao buscar pedidos.");
      }
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const pedido = pedidos.find((p) => p.id === id);
      if (!pedido) return;
      await atualizarPedido(id, { ...pedido, status: novoStatus });
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido.id === id ? { ...pedido, status: novoStatus } : pedido
        )
      );
    } catch (err) {
      alert("Erro ao atualizar pedido.");
    }
  };

  const calcularTotal = (itens) =>
    itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

  return (
    <div className="pedidosadm-container">
      <Navbar />
      <main className="pedidosadm-main">
        <aside className="pedidosadm-tabnav">
          <button onClick={() => navigate("/Vendas")} className="pedidosadm-link">
            Dashboard
          </button>
          <button onClick={() => navigate("/estoque")} className="pedidosadm-link">
            Estoque
          </button>
          <button className="pedidosadm-link ativo">Pedidos</button>
        </aside>

        <section className="pedidosadm-content">
          <h1 className="pedidosadm-titulo">Painel de Pedidos</h1>

          <div className="pedidosadm-abas">
            {["emAndamento", "emSeparacao", "finalizado"].map((status) => (
              <button
                key={status}
                onClick={() => setAbaAtiva(status)}
                className={`pedidosadm-aba ${abaAtiva === status ? "ativa" : ""}`}
              >
                {status === "emAndamento"
                  ? "Em andamento"
                  : status === "emSeparacao"
                  ? "Em separação"
                  : "Finalizado"}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Carregando pedidos...</p>
          ) : (
            <div className="pedidosadm-lista">
              {pedidos.filter((p) => p.status === abaAtiva).length > 0 ? (
                pedidos
                  .filter((p) => p.status === abaAtiva)
                  .map((pedido) => (
                    <div className="pedidosadm-item" key={pedido.id}>
                      <div>
                        <p className="pedidosadm-empresa">{pedido.empresa}</p>
                        <p className="pedidosadm-descricao">
                          #PedidoNumero: {pedido.id} - Cliente: {pedido.cliente}
                        </p>
                        <p className="pedidosadm-data">{pedido.data}</p>
                        <ul className="pedidosadm-itens">
                          {pedido.itens.map((item, index) => (
                            <li key={index}>
                              {item.quantidade}x {item.nome} - R$ {(item.preco * item.quantidade).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        <p className="pedidosadm-total">
                          Total: R$ {calcularTotal(pedido.itens).toFixed(2)}
                        </p>
                      </div>
                      <div className="pedidosadm-acoes">
                        {abaAtiva === "emAndamento" && (
                          <>
                            <button
                              className="pedidosadm-avaliar"
                              onClick={() => atualizarStatus(pedido.id, "emSeparacao")}
                            >
                              Enviar para Separação
                            </button>
                            <button
                              className="pedidosadm-cancelar"
                              onClick={() => atualizarStatus(pedido.id, "cancelado")}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {abaAtiva === "emSeparacao" && (
                          <>
                            <button
                              className="pedidosadm-avaliar"
                              onClick={() => atualizarStatus(pedido.id, "finalizado")}
                            >
                              Marcar como Entregue
                            </button>
                            <button
                              className="pedidosadm-cancelar"
                              onClick={() => atualizarStatus(pedido.id, "cancelado")}
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        <button
                          className="pedidosadm-ver"
                          onClick={() => setPedidoSelecionado(pedido)}
                        >
                          Visualizar
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p>Nenhum pedido encontrado.</p>
              )}
            </div>
          )}

          {pedidoSelecionado && (
            <div className="pedidosadm-overlay">
              <PedidoDetalhe pedido={pedidoSelecionado} onClose={() => setPedidoSelecionado(null)} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PedidosAdm;