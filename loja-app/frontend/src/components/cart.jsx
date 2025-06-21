import React, { useState, useContext } from "react";
import "./cart.css";
import { useCarrinho } from "../services/CarrinhoContext";
import { criarPedido } from "../services/pedidos";
import { useAuth } from "../services/AuthContext";

function Cart() {
  const {
    itens,
    total,
    loading,
    removerItem,
    atualizarQuantidade,
    finalizar,
  } = useCarrinho();

  const { user } = useAuth(); // Corrigido para 'user'

  const [editing, setEditing] = useState(null);
  const [quantidadeEdit, setQuantidadeEdit] = useState(1);
  const [finalizando, setFinalizando] = useState(false);

  const iniciarEdicao = (item) => {
    setEditing(item.id || item.produtoId);
    setQuantidadeEdit(item.quantidade || 1);
  };

  const cancelarEdicao = () => {
    setEditing(null);
    setQuantidadeEdit(1);
  };

  const salvarEdicao = async (id) => {
    if (quantidadeEdit < 1) {
      alert("Quantidade deve ser no mínimo 1");
      return;
    }
    await atualizarQuantidade(id, quantidadeEdit);
    setEditing(null);
  };

  const handleFinalizarCompra = async () => {
    if (itens.length === 0) return;
    setFinalizando(true);
    try {
      if (!user?.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        setFinalizando(false);
        return;
      }
      console.log("Usuário no contexto:", user);
      console.log("Endereço:", user?.endereco);
      console.log("Endereço ID:", user?.endereco?.id);
      const enderecoId = user.endereco?.id || (user.enderecos?.[0]?.id) || null;

      if (!enderecoId) {
        alert("Endereço não encontrado. Cadastre um endereço antes de finalizar a compra.");
        setFinalizando(false);
        return;
      }

      const pedido = {
        usuarioId: user.id,
        enderecoId,
        total,
        status: "emAndamento",
        metodoPagamento: "dinheiro",
        itens: itens.map((item) => ({
          produtoId: item.id || item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          nome: item.nome || item.Produto?.nome,
        })),
      };

      await criarPedido(pedido);

      alert("Compra finalizada com sucesso!");
    } catch (error) {
      alert("Erro ao finalizar a compra. Tente novamente.");
    } finally {
      setFinalizando(false);
    }
  };

  if (loading) {
    return <div className="cart-container">Carregando carrinho...</div>;
  }

  return (
    <div className="cart-container">
      <h3>Meu Carrinho</h3>
      {itens.length === 0 ? (
        <p className="cart-empty">Seu carrinho está vazio</p>
      ) : (
        <>
          {itens.map((item) => {
            const id = item.id || item.produtoId;
            const nome = item.Produto?.nome || item.nome || "Produto sem nome";
            const preco = item.Produto?.preco || item.preco || 0;
            const quantidade = item.quantidade || 1;
            const valorTotal = preco * quantidade;
            const isEditing = editing === id;

            return (
              <div key={id} className="item-carrinho">
                <div className="item-nome">{nome}</div>
                <div className="item-acoes">
                  {isEditing ? (
                    <div className="edicao-quantidade">
                      <input
                        type="number"
                        min="1"
                        value={quantidadeEdit}
                        onChange={(e) =>
                          setQuantidadeEdit(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                      />
                      <button onClick={() => salvarEdicao(id)}>Salvar</button>
                      <button onClick={cancelarEdicao}>Cancelar</button>
                    </div>
                  ) : (
                    <p>
                      R$ {valorTotal.toFixed(2)} (x{quantidade})
                    </p>
                  )}
                  <div className="botoes">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => iniciarEdicao(item)}
                          className="editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removerItem(id)}
                          className="remover"
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="resumo">
            <div className="resumo-texto">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              className="finalizar"
              disabled={itens.length === 0 || finalizando}
              onClick={handleFinalizarCompra}
            >
              {finalizando ? "Finalizando..." : "Finalizar Pedido"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
