import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

function SemAlcool() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para normalizar strings (lowercase, sem acentos, espaços normalizados)
  function normalize(str) {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  // Requisição para buscar os produtos da categoria "Sem Alcool" (flexível)
  useEffect(() => {
    fetch("http://localhost:8000/produtos")
      .then(response => response.json())
      .then(data => {
        const filtrados = data.filter(p => {
          const cat = normalize(p.categoria || "");
          return cat.includes("sem alcool") || cat.includes("semalcool");
        });

        const adaptados = filtrados.map(p => ({
          ...p,
          preco: Number(p.preco),
          desc: p.descricao,
          img: p.img?.trim() || "/IMG/icone/cerveja.png"
        }));

        setProdutos(adaptados);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Adiciona item ao carrinho, incrementando quantidade se já existir
  const adicionarItem = (nome, preco) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.nome === nome);
      if (idx > -1) {
        const novoCarrinho = [...prev];
        novoCarrinho[idx].quantidade += 1;
        return novoCarrinho;
      } else {
        return [...prev, { nome, preco, quantidade: 1 }];
      }
    });
  };

  // Filtra produtos pelo termo da busca
  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 bg-gray-800 p-4 border-r border-gray-400">
          <div
            className="my-2 font-bold cursor-pointer hover:text-blue-600"
            onClick={() => navigate('/Cerveja')}
          >
            Cervejas
          </div>
          <div
            className="my-2 font-bold cursor-pointer hover:text-blue-600"
            onClick={() => navigate('/Destilados')}
          >
            Destilados
          </div>
          <div
            className="my-2 font-bold cursor-pointer hover:text-blue-600"
            onClick={() => navigate('/Vinhos')}
          >
            Vinhos
          </div>
          <div
            className="my-2 font-bold cursor-pointer hover:text-blue-600"
            onClick={() => navigate('/SemAlcool')}
          >
            Sem Álcool
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <input
            type="text"
            className="w-full p-2 mb-6 border border-gray-300 rounded"
            placeholder="Pesquisar"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <h2 className="text-2xl font-bold mb-4">Sem Álcool</h2>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {filtrados.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-300 rounded p-4 text-center hover:shadow cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => adicionarItem(p.nome, p.preco)}
                  onKeyDown={e => { if (e.key === 'Enter') adicionarItem(p.nome, p.preco) }}
                >
                  <p className="font-bold">{p.nome}</p>
                  <p className="text-sm text-gray-600 mb-2">{p.desc}</p>
                  <img
                    src={p.img}
                    alt={p.nome}
                    className="w-[100px] h-[140px] object-cover mx-auto mb-2"
                  />
                  <p className="text-lg font-semibold">R$ {p.preco.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Cart */}
        <Cart cartItems={cartItems} setCartItems={setCartItems} />
      </div>

      <Footer />
    </div>
  );
}

export default SemAlcool;