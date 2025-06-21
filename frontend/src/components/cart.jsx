import React, { useState, useEffect } from "react"; // Adicionei o useEffect
import "./cart.css";
import { useCarrinho } from "../services/CarrinhoContext";
import { criarPedido } from "../services/pedidos";
import useAuth from "../services/AuthContext";
import ModalPagamento from "./ModalPagemento";
import { useNavigate } from "react-router-dom"; // Importei o useNavigate

function Cart() {
  const {
    itens,
    total,
    loading,
    removerItem,
    atualizarQuantidade,
    finalizar,
  } = useCarrinho();

  const { user } = useAuth();
  const navigate = useNavigate(); // Hook para navegação

  const [editing, setEditing] = useState(null);
  const [quantidadeEdit, setQuantidadeEdit] = useState(1);
  const [finalizando, setFinalizando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarLoginModal, setMostrarLoginModal] = useState(false); // Novo state para modal de login

  // Verifica se o usuário está logado quando tenta finalizar compra
  const verificarLoginAntesFinalizar = () => {
    if (!user) {
      setMostrarLoginModal(true);
      return false;
    }
    return true;
  };

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

  const irParaLogin = () => {
    navigate("/login", { state: { from: "/carrinho" } }); // Redireciona para login
  };

  const continuarComoVisitante = () => {
    setMostrarLoginModal(false); // Fecha o modal e permite continuar visualizando
  };

  const confirmarPagamento = async (metodoPagamento) => {
    // Verifica login novamente antes de prosseguir
    if (!verificarLoginAntesFinalizar()) return;

    if (itens.length === 0) return;
    setFinalizando(true);

    try {
      if (!user?.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        setFinalizando(false);
        return;
      }

      const enderecoId = user.endereco?.id || user.enderecos?.[0]?.id || null;

      if (!enderecoId) {
        alert("Endereço não encontrado. Cadastre um endereço antes.");
        setFinalizando(false);
        return;
      }

      const pedido = {
        usuarioId: user.id,
        enderecoId,
        total,
        status: "emAndamento",
        metodoPagamento,
        itens: itens.map((item) => ({
          produtoId: item.id || item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          nome: item.nome || item.Produto?.nome,
        })),
      };

      await criarPedido(pedido);
      alert("Compra finalizada com sucesso!");

      finalizar();
    } catch (error) {
      alert("Erro ao finalizar a compra. Tente novamente.");
    } finally {
      setMostrarModal(false);
      setFinalizando(false);
    }
  };

  // Atualizado o botão de finalizar compra para verificar login
  const handleFinalizarClick = () => {
    if (verificarLoginAntesFinalizar()) {
      setMostrarModal(true);
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
              onClick={handleFinalizarClick}
            >
              {finalizando ? "Finalizando..." : "Ir para Pagamento"}
            </button>
          </div>
        </>
      )}

      {/* Modal de pagamento */}
      {mostrarModal && (
        <ModalPagamento
          total={total}
          itens={itens}
          formaEntrega={user?.formaEntrega || "Não informada"}
          onClose={() => setMostrarModal(false)}
          onConfirm={confirmarPagamento}
        />
      )}

      {/* Modal de login necessário */}
      {mostrarLoginModal && (
        <div className="modal-overlay">
          <div className="modal-login">
            <h3>Login Necessário</h3>
            <p>Você precisa estar logado para finalizar a compra.</p>
            <div className="modal-botoes">
              <button onClick={irParaLogin} className="btn-login">
                Fazer Login
              </button>
              <button onClick={continuarComoVisitante} className="btn-visitante">
                Continuar como Visitante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;