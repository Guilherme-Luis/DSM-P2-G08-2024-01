import React from "react";
import "./PedidoDetalhe.css";

const PedidoDetalhe = ({ pedido, onClose }) => {
  if (!pedido) return null;

  const endereco = pedido.endereco;
  const usuario = pedido.usuario;

  const formatarData = (data) => {
    const dt = new Date(data);
    return dt.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="pedido-detalhe-painel">
      <button className="fechar" onClick={onClose}>×</button>
      <h2>Pedido #{pedido.id.slice(0, 8)}</h2>

      <div className="secao">
        <h3>Cliente</h3>
        <p><strong>Nome:</strong> {usuario?.nome}</p>
        <p><strong>Email:</strong> {usuario?.email}</p>
      </div>

      <div className="secao">
        <h3>Endereço</h3>
        <p>{endereco?.rua}, {endereco?.numero}</p>
        <p>{endereco?.cidade} - {endereco?.estado}</p>
        <p>{endereco?.cep}</p>
      </div>

      <div className="secao">
        <h3>Informações do Pedido</h3>
        <p><strong>Status:</strong> {pedido.status}</p>
        <p><strong>Data:</strong> {formatarData(pedido.createdAt)}</p>
        <p><strong>Pagamento:</strong> {pedido.metodoPagamento}</p>
      </div>

      <div className="secao">
        <h3>Itens</h3>
        <ul>
          {pedido.itens.map((item, i) => (
            <li key={i}>
              {item.quantidade}x {item.nome} - R$ {(item.precoTotal).toFixed(2)}
            </li>
          ))}
        </ul>
        <p><strong>Total:</strong> R$ {parseFloat(pedido.total).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PedidoDetalhe;
