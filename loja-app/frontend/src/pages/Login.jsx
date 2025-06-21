import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/api';
import { useAuth } from '../services/AuthContext';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // <-- CONTEXTO

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUsuario({ email, senha });
      setUser({
        id: res.data.usuarioId,
        nome: res.data.nome,
        email: res.data.email,
        token: res.data.token,
        fotoUrl: res.data.fotoUrl, // se existir
        endereco: res.data.endereco 
      });
      console.log('Usuário logado:', res);
      navigate('/home');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Falha no login');
    }
  };

  return (
    <div className="pagina-login">
      <form className="card-login" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>

        <div className="cadastro-link">
          <span>Não tem conta? </span>
          <button 
            type="button" 
            onClick={() => navigate('/cadastro')}
          >
            Cadastre-se
          </button>
        </div>
      </form>
    </div>
  );
}
