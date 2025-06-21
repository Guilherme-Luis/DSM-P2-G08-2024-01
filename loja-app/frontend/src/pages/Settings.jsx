import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { buscarUsuarioPorId, atualizarUsuario } from '../services/api';
import './cadastro.css';

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    dataNascimento: '',
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    async function carregarDados() {
      try {
        const usuario = await buscarUsuarioPorId(user.id);

        // Se endereço é uma string, tenta separar (opcional, pode adaptar conforme sua necessidade)
        let rua = '', numero = '', cidade = '', estado = '', cep = '';
        if (typeof usuario.endereco === 'string') {
          // Exemplo simples de parse — adapte se quiser algo mais robusto
          // Supondo formato: "Rua X, 123, Cidade - Estado, CEP: 12345-678"
          const parts = usuario.endereco.split(',');
          if (parts.length >= 4) {
            rua = parts[0].trim();
            numero = parts[1].trim();
            const cidadeEstado = parts[2].split('-');
            if (cidadeEstado.length === 2) {
              cidade = cidadeEstado[0].trim();
              estado = cidadeEstado[1].trim();
            }
            cep = parts[3].replace('CEP:', '').trim();
          } else {
            // Se não conseguir separar, joga tudo em rua só para não perder info
            rua = usuario.endereco;
          }
        } else if (usuario.endereco) {
          // Se for objeto (ex: se backend mudar no futuro)
          rua = usuario.endereco.rua || '';
          numero = usuario.endereco.numero || '';
          cidade = usuario.endereco.cidade || '';
          estado = usuario.endereco.estado || '';
          cep = usuario.endereco.cep || '';
        }

        setForm({
          nome: usuario.nome || '',
          email: usuario.email || '',
          senha: '',
          dataNascimento: usuario.dataNascimento || '',
          rua,
          numero,
          cidade,
          estado,
          cep
        });
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        alert('Erro ao carregar dados do usuário.');
      }
    }
    carregarDados();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert('Usuário não autenticado.');
      return;
    }
    setLoading(true);
    try {
      // Concatena o endereço em uma única string
      const enderecoCompleto = `${form.rua}, ${form.numero}, ${form.cidade} - ${form.estado}, CEP: ${form.cep}`;

      const usuarioAtualizado = {
        nome: form.nome,
        email: form.email,
        senha: form.senha || undefined,
        dataNascimento: form.dataNascimento,
        endereco: enderecoCompleto
      };

      await atualizarUsuario(user.id, usuarioAtualizado);
      alert('Perfil atualizado com sucesso!');
      navigate('/home');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert('Erro ao atualizar perfil: ' + (err.response?.data?.erro || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina-login">
      <form className="card-login" onSubmit={handleAtualizar}>
        <h2>Editar Perfil</h2>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} />
        <input name="senha" type="password" placeholder="Nova Senha" onChange={handleChange} />
        <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
        <input name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} />
        <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} />
        <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
        <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
        <input name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</button>

        <div className="voltar-login">
          <button type="button" onClick={() => navigate('/home')}>Voltar</button>
        </div>
      </form>
    </div>
  );
}