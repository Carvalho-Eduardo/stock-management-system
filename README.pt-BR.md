 <p align="center">
  <a href="./README.md">🇺🇸 English</a> |
  <a href="./README.pt-BR.md">🇧🇷 Português</a>
</p>

---

<h1 align="center">StockFlow</h1>

<p align="center">
  <strong>Sistema de Gerenciamento de Estoque</strong>
  <br/>
  Uma aplicação web full-stack para gerenciamento de produtos, fornecedores, compras e operações de estoque.
</p>

<p align="center">
  <a href="https://stock-management-system-two-livid.vercel.app/">
    <img src="https://img.shields.io/badge/Demonstração_Online-Acessar_Aplicação-A9BFFF?style=for-the-badge&logo=vercel&logoColor=black" alt="Demonstração Online"/>
  </a>
  <a href="https://github.com/Carvalho-Eduardo/stock-management-system">
    <img src="https://img.shields.io/badge/GitHub-Repositório-181717?style=for-the-badge&logo=github&logoColor=white" alt="Repositório GitHub"/>
  </a>
</p>

---

## Sobre o Projeto

O **StockFlow** é um sistema full-stack de gerenciamento de estoque desenvolvido para centralizar e simplificar operações de controle de estoque por meio de uma interface web moderna.

A aplicação oferece ferramentas para gerenciar produtos, categorias, fornecedores, compras e movimentações de estoque, reunindo operações essenciais em uma única plataforma.

O projeto foi desenvolvido para aplicar conceitos de desenvolvimento de software em um ambiente prático, abrangendo desenvolvimento frontend, arquitetura backend, integração com API REST, persistência de dados, autenticação e implantação em nuvem.

## Funcionalidades

- **Dashboard:** visão geral dos indicadores e informações do estoque.
- **Produtos:** cadastro, consulta, atualização, pesquisa e exclusão de produtos.
- **Categorias:** organização dos produtos por categorias.
- **Fornecedores:** cadastro e gerenciamento de informações dos fornecedores.
- **Compras:** gerenciamento de registros de compras.
- **Movimentações:** acompanhamento das movimentações de estoque.
- **Autenticação:** cadastro de usuários e login com JWT.
- **Perfil:** atualização de informações pessoais e gerenciamento da foto de perfil.
- **Auditoria:** acesso aos registros de auditoria do sistema.

## Tecnologias e Ferramentas

### Linguagens de Programação

<p align="left">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
</p>

### Frontend

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router"/>
</p>

### Backend e APIs

<p align="left">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven"/>
</p>

### Banco de Dados

<p align="left">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TiDB_Cloud-DC382D?style=for-the-badge&logo=tidb&logoColor=white" alt="TiDB Cloud"/>
</p>

### Ferramentas e Infraestrutura

<p align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"/>
</p>

## Arquitetura da Aplicação

O StockFlow utiliza uma arquitetura separada entre frontend e backend.

```text
StockFlow
│
├── frontend/
│   ├── React
│   ├── Vite
│   ├── Tailwind CSS
│   └── Axios
│
└── backend/
    ├── Java 21
    ├── Spring Boot
    ├── Spring Security
    ├── Spring Data JPA
    └── Hibernate
```

O frontend é responsável pela interface e se comunica com o backend por meio de uma API REST.

O backend concentra as regras de negócio, autenticação, processamento de dados e operações com o banco de dados.

## Acessando a Aplicação

Existem duas formas de utilizar o StockFlow, dependendo do seu objetivo.

### 1. Demonstração Online — Aplicação Hospedada

<p align="center">
  <a href="https://stock-management-system-two-livid.vercel.app/">
    <img src="https://img.shields.io/badge/ACESSAR_APLICAÇÃO_ONLINE-A9BFFF?style=for-the-badge&logo=vercel&logoColor=black" alt="Acessar Aplicação Online"/>
  </a>
</p>

A versão de produção já está hospedada e disponível pela internet.

- Não é necessário instalar nada.
- Não é necessário configurar um ambiente local.
- Acesse diretamente pelo navegador.
- Frontend hospedado na Vercel.
- Backend hospedado no Render.
- Banco de dados hospedado na TiDB Cloud.

Para utilizar o sistema, basta acessar o link acima e criar uma conta pela página de cadastro.

### 2. Desenvolvimento Local — Executar no Computador

Se você deseja explorar o código-fonte, modificar a aplicação ou executar seu próprio ambiente de desenvolvimento, siga as instruções abaixo.

#### Pré-requisitos

- Git
- Node.js e npm
- Java JDK 21
- Banco de dados compatível com MySQL

#### Clonar o Repositório

```bash
git clone https://github.com/Carvalho-Eduardo/stock-management-system.git

cd stock-management-system
```

#### Configurar e Executar o Backend

Acesse a pasta do backend:

```bash
cd backend
```

Configure a conexão com o banco de dados e as seguintes variáveis de ambiente:

| Variável | Descrição |
|---|---|
| `DB_USERNAME` | Usuário do banco de dados |
| `DB_PASSWORD` | Senha do banco de dados |
| `JWT_SECRET` | Chave secreta utilizada na assinatura dos tokens JWT |

Inicie o backend:

```powershell
.\mvnw.cmd spring-boot:run
```

#### Configurar e Executar o Frontend

Abra outro terminal e acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse o endereço local disponibilizado pelo Vite, normalmente:

```text
http://localhost:5173
```

Certifique-se de que o frontend esteja configurado para se comunicar com o backend local e que o backend consiga acessar o banco de dados configurado.

#### Comandos Adicionais do Frontend

Gerar a versão de produção:

```bash
npm run build
```

Executar o ESLint:

```bash
npm run lint
```

Visualizar a versão de produção:

```bash
npm run preview
```

## Implantação

O ambiente de produção está distribuído entre três serviços:

| Serviço | Plataforma | Responsabilidade |
|---|---|---|
| Frontend | Vercel | Aplicação web |
| Backend | Render | API REST |
| Banco de dados | TiDB Cloud | Persistência de dados |

## Segurança

- Autenticação baseada em JWT.
- Proteção dos recursos da aplicação.
- Variáveis de ambiente para configurações sensíveis.
- Separação de responsabilidades entre frontend e backend.

Nunca envie credenciais reais, senhas ou chaves secretas para o repositório.

## Objetivos do Projeto

O StockFlow foi desenvolvido para fortalecer conhecimentos práticos de engenharia de software por meio de uma aplicação completa.

O projeto abrange:

- Desenvolvimento frontend com React.
- Desenvolvimento de APIs REST com Spring Boot.
- Persistência de dados com JPA e Hibernate.
- Autenticação e segurança com JWT.
- Integração entre frontend e backend.
- Gerenciamento de banco de dados relacional.
- Versionamento com Git e GitHub.
- Deploy e configuração de aplicações em nuvem.

---

## Autor

<p align="center">
  <strong>Eduardo Carvalho</strong>
  <br/>
  Desenvolvedor de Software | Estudante de Análise e Desenvolvimento de Sistemas
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/e-duardo-carvalho/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="mailto:e.duardo.carvalho@outlook.com">
    <img src="https://img.shields.io/badge/Enviar_um_E--mail-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white" alt="E-mail"/>
  </a>
  <a href="https://instagram.com/eduardocarvalho.dev">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/>
  </a>
</p>

<p align="center">
  <sub>Construindo conhecimento, um projeto de cada vez.</sub>
</p>
