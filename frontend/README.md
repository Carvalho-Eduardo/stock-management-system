
# StockFlow

Sistema web de gestão e controle de estoque.

O StockFlow tem como objetivo facilitar o gerenciamento de produtos, categorias, fornecedores, compras e movimentações de estoque por meio de uma interface moderna e intuitiva.

## Tecnologias

### Frontend
- React
- JavaScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React
- Recharts
- Axios

### Backend
- Java
- Spring Boot
- MySQL

## Estrutura do projeto

```text
src/
├── components/
│   ├── layout/
│   └── ui/
├── contexts/
├── hooks/
├── pages/
│   ├── Auditoria/
│   ├── Categorias/
│   ├── Compras/
│   ├── Dashboard/
│   ├── Fornecedores/
│   ├── Login/
│   ├── Movimentacoes/
│   ├── Produtos/
│   └── Usuarios/
├── services/
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

## Como executar

Entre na pasta do frontend:

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

## Outros comandos

Compilar para produção:

```bash
npm run build
```

Verificar o código:

```bash
npm run lint
```

Visualizar a versão de produção:

```bash
npm run preview
```

## Status

Projeto em desenvolvimento.
