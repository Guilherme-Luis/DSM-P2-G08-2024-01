import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/pedidos', // ajuste se necessário
});

// Listar todos os pedidos
export async function listarPedidos() {
  const response = await api.get('/');
  return response.data;
}

// Buscar pedido por ID
export async function buscarPedidoPorId(id) {
  const response = await api.get(`/${id}`);
  return response.data;
}

// Criar novo pedido
export async function criarPedido(dados) {
  const response = await api.post('/', dados);
  return response.data;
}

// Atualizar pedido
export async function atualizarPedido(id, dados) {
  const response = await api.put(`/${id}`, dados);
  return response.data;
}

// Deletar pedido
export async function deletarPedido(id) {
  const response = await api.delete(`/${id}`);
  return response.data;
}