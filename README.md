# 🛍️ Copo Cheio - Plataforma Web de Pedidos

**Projeto Integrador | 2º Semestre - FATEC DSM**

O *Copo Cheio* é uma plataforma de gerenciamento de pedidos online, voltada para pequenas empresas que desejam vender produtos por meio de um sistema completo com catálogo, carrinho, controle de pedidos, painel administrativo e relatórios. A aplicação é composta por um **frontend moderno (React + Vite)** e um **backend robusto (Node.js + Express + Sequelize)**.

## 📌 Objetivos do Projeto

- Oferecer uma plataforma digital para cadastro, visualização e gerenciamento de produtos.
- Permitir que os usuários realizem pedidos com facilidade.
- Fornecer um painel administrativo para controle interno dos pedidos em diferentes estágios.
- Apresentar relatórios de vendas e métricas essenciais para o negócio.

## 🗂️ Estrutura do Projeto
```bash
PI-2-Semestre/
├── frontend/ # Aplicação React com Vite
│ ├── src/
│ ├── index.html
│ ├── vite.config.js
│ └── ...
│
├── loja-app/ # Backend com Node.js + Express
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── db/
│ ├── views/
│ ├── app.js
│ └── ...
│
├── .gitignore
├── README.md
└── ...
```

## 🖥️ Funcionalidades

### 🌐 Frontend (React)

- Tela de login
- Tela inicial com categorias
- Listagem de produtos filtrável por categoria
- Carrinho com soma automática de valores
- Visualização do resumo da compra
- Área administrativa:
  - Visualização de pedidos separados por status: *Em Andamento*, *Em Separação*, *Finalizados*
  - Painel lateral com os detalhes do pedido
- Estilização moderna com **TailwindCSS** e **Flowbite**

### 🛠️ Backend (Node.js + Express)

- Autenticação de usuários com JWT
- Integração com banco de dados PostgreSQL via Sequelize
- API com rotas RESTful:
  - Produtos
  - Pedidos
  - Itens do Carrinho
  - Relatórios
  - Usuários
- Padrão MVC (Model - View - Controller)
- Renderização de páginas com EJS (se necessário)

## 📊 Relatórios

A aplicação também possui um módulo de relatórios que permite:
- Visualizar vendas por período
- Identificar os produtos mais vendidos
- Gerar estatísticas úteis para tomada de decisão

## 🧪 Tecnologias Utilizadas

### Frontend:

- React
- Vite
- Flowbite + TailwindCSS
- React Router DOM

### Backend:

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT
- Dotenv
- EJS (para views no backend)

## ⚙️ Como Executar o Projeto

### 🔧 Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL
- Git

### 📥 Clonando o Repositório

```bash
git clone https://github.com/RaulSayajin/PI-2-Semestre.git
```

### 📁 Instalando as Dependências do backend


- 1. Navegue até a pasta do loja-app e instale as dependências:
```bash
cd loja-app # Se for Windows
npm install
# ou
yarn install
```
### 🛠️ Configurando o Backend
- 2. Vá até no arquivo .env.exemple e configure as variáveis de ambiente necessárias, como `DB_HOST`, `DB_USER`, `DB_PASSWORD`, etcs.
- 3. Troque o nome do arquivo `.env.exemple`, para `.env`.
- 4. No banco postgreSQL execute o postgres.sql, localizado na pasta `db`, para criar o squema do banco de dados.
- 5. Execute o backend:
```bash
npm start
# ou
yarn start
```

### 📁 Instalando as Dependências do frontend

- 1. Navegue até a pasta do frontend e instale as dependências:
```bash
cd front-end # Se for Windows
npm install
# ou
yarn install
```
### 🛠️ Inicializando o Frontend

```bash
npm run dev
# ou
yarn dev
```

