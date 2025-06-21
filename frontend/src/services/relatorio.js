import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/relatorios',
});

// Relatório de Vendas
export async function getRelatorioVendas(filtro = 'mensal') {
  const response = await api.get('/', {
    params: { filtro }
  });
  return response.data;
}

// Relatório de Pedidos por Status
export async function getPedidosPorStatus() {
  const response = await api.get('/pedidos-por-status');
  return response.data;
}

// Relatório de Estoque dos Produtos
export async function getEstoqueProdutos() {
  const response = await api.get('/estoque');
  return response.data;
}