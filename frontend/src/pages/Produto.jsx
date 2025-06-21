import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  height: 48px;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 36px;
`;

const NavLink = styled.a`
  color: #232323;
  font-weight: 500;
  text-decoration: none;
  font-size: 1.08rem;
  transition: color 0.2s;
  &:hover {
    color: #666;
  }
`;

const UserIcon = styled.span`
  font-size: 2rem;
  margin-left: 28px;
  color: #232323;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Página
const PageBackground = styled.div`
  min-height: 100vh;
  background: #e5e5e5;
  padding: 0;
`;

const Content = styled.div`
  max-width: 98vw;
  margin: 0 auto;
  padding: 32px 0 0 0;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  background: transparent;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: 2px solid #888;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  color: #232323;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #232323;
  }
`;

const Button = styled.button`
  padding: 10px 22px;
  border-radius: 6px;
  border: 1.5px solid #888;
  background: #fff;
  color: #232323;
  font-weight: 600;
  font-size: 1rem;
  margin-left: 0;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover {
    background: #f3f3f3;
    border-color: #232323;
  }
`;

// Card container
const ProdutoCard = styled.div`
  display: flex;
  background: #fff;
  border-radius: 10px;
  margin: 16px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 98%;
  min-height: 150px;
`;

// Coluna da imagem
const ImagemCol = styled.div`
  flex: 0 0 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-right: 2px solid #e0e0e0;
  img {
    max-width: 110px;
    max-height: 120px;
    object-fit: contain;
    border-radius: 6px;
  }
`;

// Colunas de dados
const InfoCol = styled.div`
  flex: 1;
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: ${(props) => (props.last ? "none" : "2px solid #e0e0e0")};
  min-width: 120px;
  font-size: 1.08rem;
  strong {
    font-size: 1.08rem;
    font-weight: 700;
    display: block;
    margin-bottom: 2px;
  }
`;

// Container principal da página
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Conteúdo principal
const MainContent = styled.main`
  flex: 1;
`;

export default function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = localStorage.getItem("produtos");
    if (dados) {
      setProdutos(JSON.parse(dados));
    }
  }, []);

  // Função para excluir produto selecionado
  const excluirSelecionado = () => {
    if (selecionado === null) return;
    const novosProdutos = produtos.filter((_, i) => i !== selecionado);
    setProdutos(novosProdutos);
    localStorage.setItem("produtos", JSON.stringify(novosProdutos));
    setSelecionado(null);
  };

  const handleAdicionar = () => {
    navigate("/estoque");
  };

  const handleEditar = () => {
    if (selecionado === null) return;
    navigate(`/estoque?edit=${selecionado}`);
  };

  return (
    <PageContainer>
      <Navbar />
      <MainContent>
        <PageBackground>
          <Content>
            <SearchBarContainer>
              <SearchInput placeholder="Pesquisar..." />
              <Button onClick={handleAdicionar}>Adicionar</Button>
              <Button onClick={handleEditar}>Editar</Button>
              <Button onClick={excluirSelecionado}>Excluir</Button>
            </SearchBarContainer>

            {/* Lista todos os produtos cadastrados */}
            {produtos.length > 0 ? (
              produtos.map((produto, idx) => (
                <ProdutoCard
                  key={idx}
                  onClick={() => setSelecionado(idx)}
                  style={{
                    border:
                      selecionado === idx ? "3px solid #007bff" : "none",
                    boxShadow:
                      selecionado === idx
                        ? "0 0 10px #007bff44"
                        : "none",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <ImagemCol>
                    <img
                      src={produto.imagem || "https://via.placeholder.com/110x120?text=Sem+Imagem"}
                      alt="Produto"
                    />
                  </ImagemCol>
                  <InfoCol>
                    <strong>Nome:</strong>
                    {produto.nome}
                  </InfoCol>
                  <InfoCol>
                    <strong>Quantidade:</strong>
                    {produto.quantidade}
                  </InfoCol>
                  <InfoCol>
                    <strong>Preço de Custo:</strong>
                    R$ {Number(produto.precoCusto).toFixed(2)}
                  </InfoCol>
                  <InfoCol>
                    <strong>Preço de Venda:</strong>
                    R$ {Number(produto.precoVenda).toFixed(2)}
                  </InfoCol>
                  <InfoCol>
                    <strong>Entrada:</strong>
                    {produto.entrada}
                  </InfoCol>
                  <InfoCol last>
                    <strong>Status:</strong>
                    {produto.status}
                  </InfoCol>
                </ProdutoCard>
              ))
            ) : (
              <p>Nenhum produto cadastrado.</p>
            )}
          </Content>
        </PageBackground>
      </MainContent>
      <Footer />
    </PageContainer>
  );
}
