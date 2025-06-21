import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor para enviar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Supondo que o token fica salvo aqui
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Produtos
export function listarProdutos() {
  return api.get('/produtos');
}

export function obterProdutoPorId(id) {
  return api.get(`/produtos/${id}`);
}

// Carrinho
export async function buscarCarrinho(userId) {
  const response = await fetch(`/api/carrinho/${userId}`);
  return response.json();
}

export async function salvarCarrinho(userId, itens) {
  await fetch(`/api/carrinho/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itens }),
  });
}

export async function adicionarAoCarrinho(usuarioId, produtoId, quantidade = 1) {
  return api.post(`/carrinho/adicionar`, { usuarioId, produtoId, quantidade });
}

export function listarCarrinho(usuarioId) {
  if (!usuarioId || usuarioId === 'null') {
    return Promise.resolve({ data: { itens: [], total: 0 } });
  }
  return api.get(`/carrinho/${usuarioId}`);
}

export const removerItemCarrinho = async (usuarioId, itemId) => {
  try {
    const response = await api.delete(`/carrinho/${usuarioId}/itens/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    throw error;
  }
};

export function atualizarCarrinho(carrinhoId, quantidade) {
  return api.put(`/carrinho/atualizar/${carrinhoId}`, { quantidade });
}

export function finalizarCompra(usuarioId, pagamentoInfo) {
  return api.post(`/carrinho/finalizar/${usuarioId}`, pagamentoInfo);
}

// Usuários (Autenticação)
export function cadastrarUsuario(dados) {
  return api.post('/usuarios', dados);
}

export function loginUsuario({ email, senha }) {
  return api.post('/usuarios/login', { email, senha });
}

// Novas funções para usuário - perfil e edição
export async function buscarUsuarioPorId(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export function atualizarUsuario(id, dados) {
  return api.put(`/usuarios/atualizar/${id}`, dados);
}