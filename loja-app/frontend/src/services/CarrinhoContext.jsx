import React, { createContext, useContext, useState, useEffect } from "react";
import {
  listarCarrinho,
  removerItemCarrinho,
  atualizarCarrinho,
  finalizarCompra,
  adicionarAoCarrinho,
  obterProdutoPorId,
} from "../services/api";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ usuarioId, children }) {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCarrinho = async () => {
    setLoading(true);
    try {
      if (!usuarioId || usuarioId === "null") {
        const carrinhoLocal = JSON.parse(localStorage.getItem("carrinhoLocal")) || [];
        setItens(carrinhoLocal);
        setTotal(
          carrinhoLocal.reduce(
            (sum, item) => sum + item.preco * item.quantidade,
            0
          )
        );
      } else {
        const response = await listarCarrinho(usuarioId);
        setItens(response.data.itens || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      setItens([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrinho();
    // eslint-disable-next-line
  }, [usuarioId]);

  const adicionarItem = async (produtoId, quantidade = 1) => {
    try {
      if (!usuarioId || usuarioId === "null") {
        const carrinhoAtual = JSON.parse(localStorage.getItem("carrinhoLocal")) || [];
        const existente = carrinhoAtual.find((item) => item.id === produtoId);
        let novoCarrinho;

        if (existente) {
          novoCarrinho = carrinhoAtual.map((item) =>
            item.id === produtoId
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item
          );
        } else {
          const response = await obterProdutoPorId(produtoId);
          const produto = response.data;
          const novoItem = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade,
          };
          novoCarrinho = [...carrinhoAtual, novoItem];
        }

        localStorage.setItem("carrinhoLocal", JSON.stringify(novoCarrinho));
        setItens(novoCarrinho);
        setTotal(novoCarrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0));
      } else {
        await adicionarAoCarrinho(usuarioId, produtoId, quantidade);
        await fetchCarrinho();
      }
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
    }
  };

  const removerItem = async (id) => {
    try {
      if (!usuarioId || usuarioId === "null") {
        const carrinhoAtual = JSON.parse(localStorage.getItem("carrinhoLocal")) || [];
        const novoCarrinho = carrinhoAtual.filter((item) => item.id !== id);
        localStorage.setItem("carrinhoLocal", JSON.stringify(novoCarrinho));
        setItens(novoCarrinho);
        setTotal(novoCarrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0));
      } else {
        await removerItemCarrinho(usuarioId, id);
        await fetchCarrinho();
      }
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const atualizarQuantidade = async (id, quantidade) => {
    try {
      if (!usuarioId || usuarioId === "null") {
        const carrinhoAtual = JSON.parse(localStorage.getItem("carrinhoLocal")) || [];
        const novoCarrinho = carrinhoAtual.map((item) =>
          item.id === id ? { ...item, quantidade } : item
        );
        localStorage.setItem("carrinhoLocal", JSON.stringify(novoCarrinho));
        setItens(novoCarrinho);
        setTotal(novoCarrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0));
      } else {
        await atualizarCarrinho(id, quantidade);
        await fetchCarrinho();
      }
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  const finalizar = async () => {
    if (!usuarioId || usuarioId === "null") {
      alert("Por favor, faça login para finalizar a compra");
      return;
    }
    try {
      const pagamentoInfo = { metodo: "cartão" };
      await finalizarCompra(usuarioId, pagamentoInfo);
      alert("Compra finalizada com sucesso!");
      await fetchCarrinho();
    } catch (error) {
      alert("Erro ao finalizar compra");
    }
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        total,
        loading,
        fetchCarrinho,
        removerItem,
        atualizarQuantidade,
        finalizar,
        adicionarItem, 
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
