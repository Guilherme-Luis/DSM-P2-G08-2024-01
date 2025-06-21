import React, { useEffect, useState } from "react";
import useAuth from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  getRelatorioVendas,
  getPedidosPorStatus,
  getEstoqueProdutos,
} from "../services/relatorio";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./Vendas.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ff4c4c"];

export default function RelatorioVendas() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  const [relatorio, setRelatorio] = useState(null);
  const [pedidosStatus, setPedidosStatus] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [filtro, setFiltro] = useState("mensal");

  // Proteção da rota para somente admin acessar
  useEffect(() => {
    if (!loading) {
      if (!user || role !== "admin") {
        navigate("/login");
      }
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [vendas, status, estoqueData] = await Promise.all([
          getRelatorioVendas(filtro),
          getPedidosPorStatus(),
          getEstoqueProdutos(),
        ]);
        setRelatorio(vendas);
        setPedidosStatus(status);
        setEstoque(estoqueData);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      }
    }
    fetchData();
  }, [filtro]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="relatorio-container">
      <Navbar />
      <main className="relatorio-main">
        <aside className="estoque-tabnav">
          <button
            onClick={() => navigate("/vendas")}
            className="tabnav-link ativo"
            type="button"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/estoque")}
            className="tabnav-link" 
            type="button"
          >
            Estoque
          </button>
          <button
            onClick={() => navigate("/pedido_adm")}
            className="tabnav-link"
            type="button"
          >
            Pedidos
          </button>
        </aside>

        <section className="relatorio-content">
          <h1>Dashboard</h1>

          <div className="relatorio-filtros">
            <label htmlFor="filtro">Período:</label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="diario">Hoje</option>
              <option value="semanal">Esta semana</option>
              <option value="mensal">Este mês</option>
              <option value="anual">Este ano</option>
            </select>
          </div>

          <div className="relatorio-graficos">
            {relatorio && (
              <>
                <div className="relatorio-card">
                  <h2>Total vendido</h2>
                  <p className="valor">R$ {relatorio.total.toFixed(2)}</p>
                </div>

                <div className="relatorio-chart">
                  <h3>Produtos mais vendidos</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={relatorio.produtosMaisVendidos}>
                      <XAxis dataKey="nome" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="quantidade"
                        fill="#8884d8"
                        name="Quantidade Vendida"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="relatorio-chart">
                  <h3>Vendas por canal</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={relatorio.vendasPorCanal}
                        dataKey="valor"
                        nameKey="canal"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {relatorio.vendasPorCanal.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {pedidosStatus.length > 0 && (
              <div className="relatorio-chart">
                <h3>Pedidos por Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pedidosStatus}
                      dataKey="quantidade"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pedidosStatus.map((entry, index) => (
                        <Cell
                          key={`cell-status-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {estoque.length > 0 && (
              <div className="relatorio-chart">
                <h3>Estoque Atual</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estoque}>
                    <XAxis dataKey="nome" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="quantidade"
                      fill="#ff7f50"
                      name="Em estoque"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
