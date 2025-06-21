import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../services/api';
import './cadastro.css';

export default function Cadastro() {
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      // Monta o objeto no formato esperado pelo backend
      const usuario = {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        dataNascimento: form.dataNascimento,
        endereco: {
          rua: form.rua,
          numero: form.numero,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep
        }
      };

      const res = await cadastrarUsuario(usuario);
      console.log('Usuário cadastrado:', res);

      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar: ' + (err.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="pagina-login">
      <form className="card-login" onSubmit={handleCadastro}>
        <h2>Cadastro</h2>
        <input name="nome" placeholder="Nome" onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} />
        <input name="senha" type="password" placeholder="Senha" onChange={handleChange} />
        <input name="dataNascimento" type="date" onChange={handleChange} />
        <input name="rua" placeholder="Rua" onChange={handleChange} />
        <input name="numero" placeholder="Número" onChange={handleChange} />
        <input name="cidade" placeholder="Cidade" onChange={handleChange} />
        <input name="estado" placeholder="Estado" onChange={handleChange} />
        <input name="cep" placeholder="CEP" onChange={handleChange} />
        <button type="submit">Cadastrar</button>

        <div className="voltar-login">
          <span>Já tem conta? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Voltar para Login
          </button>
        </div>
      </form>
    </div>
  );
}