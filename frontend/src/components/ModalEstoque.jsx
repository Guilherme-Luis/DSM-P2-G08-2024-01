import React, { useState } from "react";
import "./Modal.css"; // ajuste para o arquivo correto

export default function ModalAdicionarProduto({ onClose, onAdd }) {
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    quantidade: 0,
    preco: 0,
    ativo: true,
    img: "",
  });

  const categorias = [
    "Bebidas",
    "Alimentos",
    "Eletrônicos",
    "Roupas",
    "Outros",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "quantidade") {
      newValue = value === "" ? 0 : parseInt(value);
    } else if (name === "preco") {
      newValue = value === "" ? 0 : parseFloat(value);
    } else if (name === "ativo") {
      newValue = value === "true";
    }

    setProduto((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!produto.nome || !produto.descricao || !produto.categoria) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onAdd(produto);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Novo Produto</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="nome"
            placeholder="Nome"
            value={produto.nome}
            onChange={handleChange}
            required
          />
          <input
            name="descricao"
            placeholder="Descrição"
            value={produto.descricao}
            onChange={handleChange}
            required
          />
          <select
            name="categoria"
            value={produto.categoria}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecione a categoria
            </option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            name="quantidade"
            type="number"
            placeholder="Quantidade"
            value={produto.quantidade}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            name="preco"
            type="number"
            step="0.01"
            placeholder="Preço"
            value={produto.preco}
            onChange={handleChange}
            min="0"
            required
          />

          <select
            name="ativo"
            value={produto.ativo.toString()}
            onChange={handleChange}
          >
            <option value="true">Em estoque</option>
            <option value="false">Esgotado</option>
          </select>

          <input
            name="img"
            placeholder="URL da imagem"
            value={produto.img}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit">Adicionar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
