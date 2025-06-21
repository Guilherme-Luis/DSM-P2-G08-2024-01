import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './services/AuthContext';
import { CarrinhoProvider } from './services/CarrinhoContext';

import './index.css';
import 'flowbite';
import 'flowbite-react';
import 'flowbite/dist/flowbite.css';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Categoria from './pages/Categoria';
import Sobrenos from './pages/sobrenos';
import Pedidos from './pages/pedidos';
import Destilados from './pages/Destilados';
import Vinhos from './pages/Vinhos';
import Login from './pages/login';
import Cadastro from './pages/cadastro';      // Import corrigido aqui
import Settings from './pages/Settings';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarrinhoProvider>
          <Routes>
            {/* Página inicial agora é Login */}
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/Categoria" element={<Categoria />} />
            <Route path="/categoria/:nomeCategoria" element={<Categoria />} />
            <Route path="/sobrenos" element={<Sobrenos />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/Destilados" element={<Destilados />} />
            <Route path="/Vinhos" element={<Vinhos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </CarrinhoProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);