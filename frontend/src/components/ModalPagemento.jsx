import React, { useState } from "react";
import "./ModalPagamento.css";

export default function ModalPagamento({ total, itens, formaEntrega, onClose, onConfirm }) {
  const [metodo, setMetodo] = useState("pix");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(metodo);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirme seu pedido</h2>

        {/* Detalhes do Pedido */}
        <div className="detalhes-pedido">
          <h3>Itens do pedido:</h3>
          <ul>
            {itens.map((item, index) => (
              <li key={index}>
                {item.quantidade}x {item.nome} - R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Subtotal:</strong> R$ {total.toFixed(2)}</p>
        </div>

        {/* Forma de entrega */}
        <div className="forma-entrega">
          <strong>Forma de entrega:</strong> {formaEntrega || "Não especificado"}
        </div>

        {/* Formulário de pagamento */}
        <form onSubmit={handleSubmit} className="modal-form">
          <h3>Escolha o método de pagamento</h3>

          <label>
            <input
              type="radio"
              name="pagamento"
              value="pix"
              checked={metodo === "pix"}
              onChange={(e) => setMetodo(e.target.value)}
            />
            PIX
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="credito"
              checked={metodo === "credito"}
              onChange={(e) => setMetodo(e.target.value)}
            />
            Cartão de Crédito
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="debito"
              checked={metodo === "debito"}
              onChange={(e) => setMetodo(e.target.value)}
            />
            Cartão de Débito
          </label>
          <label>
            <input
              type="radio"
              name="pagamento"
              value="dinheiro"
              checked={metodo === "dinheiro"}
              onChange={(e) => setMetodo(e.target.value)}
            />
            Dinheiro (Pagamento na Entrega)
          </label>

          <p className="total-modal"><strong>Total a pagar:</strong> R$ {total.toFixed(2)}</p>

          <div className="modal-actions">
            <button type="submit">Finalizar Pedido</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
