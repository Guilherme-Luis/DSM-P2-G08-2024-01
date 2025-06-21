import React, { useState, useEffect } from "react";
import "./Modal.css";

export default function ModalEditarProduto({ produto, onClose, onSave }) {
  const [produtoEditado, setProdutoEditado] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    quantidade: 0,
    preco: 0,
    ativo: true,
    img: "",
  });

  // Inicializa estado com produto passado por prop
  useEffect(() => {
    if (produto) {
      setProdutoEditado({
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        categoria: produto.categoria || "",
        quantidade: produto.quantidade || 0,
        preco: produto.preco || 0,
        ativo: produto.ativo ?? true,
        img: produto.img || "",
      });
    }
  }, [produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "quantidade") {
      newValue = parseInt(value);
    } else if (name === "preco") {
      newValue = parseFloat(value);
    } else if (name === "ativo") {
      newValue = value === "true";
    }

    setProdutoEditado((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !produtoEditado.nome ||
      !produtoEditado.descricao ||
      !produtoEditado.categoria
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    onSave(produtoEditado);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Produto</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="nome"
            placeholder="Nome"
            value={produtoEditado.nome}
            onChange={handleChange}
            required
          />
          <input
            name="descricao"
            placeholder="Descrição"
            value={produtoEditado.descricao}
            onChange={handleChange}
            required
          />
          <input
            name="categoria"
            placeholder="Categoria"
            value={produtoEditado.categoria}
            onChange={handleChange}
            required
          />
          <input
            name="quantidade"
            type="number"
            placeholder="Quantidade"
            value={produtoEditado.quantidade}
            onChange={handleChange}
            min="0"
            required
          />
          <input
            name="preco"
            type="number"
            step="0.01"
            placeholder="Preço"
            value={produtoEditado.preco}
            onChange={handleChange}
            min="0"
            required
          />
          <select
            name="ativo"
            value={produtoEditado.ativo.toString()}
            onChange={handleChange}
          >
            <option value="true">Em estoque</option>
            <option value="false">Esgotado</option>
          </select>
          <input
            name="img"
            placeholder="URL da imagem"
            value={produtoEditado.img}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
