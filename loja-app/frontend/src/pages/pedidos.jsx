import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Cart from "../components/cart";
import { listarPedidos } from "../services/pedidos"; // <-- importe aqui
import "./Pedido.css";

const Pedidos = () => {
  const [abaAtiva, setAbaAtiva] = useState("emAndamento");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        setLoading(true);
        const data = await listarPedidos();
        setPedidos(data); // ajuste conforme o formato retornado pela API
      } catch (err) {
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  return (
    <div className="pagina">
      <Navbar />
      <main className="conteudo">
        <div className="container">
          <section className="pedidos">
            <div className="abas">
              {["emAndamento", "finalizado"].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setAbaAtiva(tipo)}
                  className={`aba-botao ${abaAtiva === tipo ? "ativa" : ""}`}
                >
                  {tipo === "emAndamento" ? "Em andamento" : "Finalizado"}
                </button>
              ))}
            </div>

            {/* Conteúdo da Aba */}
            {loading ? (
              <p>Carregando pedidos...</p>
            ) : abaAtiva === "emAndamento" ? (
              pedidos.length > 0 ? (
                pedidos
                  .filter((p) => p.status !== "finalizado")
                  .map((pedido) => (
                    <div className="pedido-item" key={pedido.id}>
                      <div>
                        <p className="titulo">{pedido.empresa || "Empresa"}</p>
                        <p className="descricao">#PedidoNumero: {pedido.id}</p>
                        <p className="data">
                          {pedido.data || "Data não informada"}
                        </p>
                      </div>
                      <div className="acoes">
                        <button className="avaliar">Avaliar Pedido</button>
                        <a href="#" className="ver">
                          Visualizar
                        </a>
                      </div>
                    </div>
                  ))
              ) : (
                <p>Nenhum pedido em andamento.</p>
              )
            ) : pedidos.filter((p) => p.status === "finalizado").length > 0 ? (
              pedidos
                .filter((p) => p.status === "finalizado")
                .map((pedido) => (
                  <div className="pedido-item" key={pedido.id}>
                    <div>
                      <p className="titulo">{pedido.empresa || "Empresa"}</p>
                      <p className="descricao">#PedidoNumero: {pedido.id}</p>
                      <p className="data">
                        {pedido.data || "Data não informada"}
                      </p>
                    </div>
                    <div className="acoes">
                      <button className="avaliar">Avaliar Pedido</button>
                      <a href="#" className="ver">
                        Visualizar
                      </a>
                    </div>
                  </div>
                ))
            ) : (
              <div className="nenhum-finalizado">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icone"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
                  />
                </svg>
                <p>Nenhum pedido finalizado.</p>
              </div>
            )}
          </section>
          <Cart />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pedidos;
