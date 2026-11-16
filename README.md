 <p align="center">
  <a href="./README.md">🇺🇸 English</a> |
  <a href="./README.pt-BR.md">🇧🇷 Português</a>
</p>

---

<h1 align="center">StockFlow</h1>

<p align="center">
  <strong>Inventory Management System</strong>
  <br/>
  A full-stack web application for managing products, suppliers, purchases, and inventory operations.
</p>

<p align="center">
  <a href="https://stock-management-system-two-livid.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Access_Application-A9BFFF?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo"/>
  </a>
  <a href="https://github.com/Carvalho-Eduardo/stock-management-system">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
  </a>
</p>

---

## About the Project

**StockFlow** is a full-stack inventory management system developed to centralize and simplify inventory operations through a modern web interface.

The application provides tools for managing products, categories, suppliers, purchases, and stock movements, bringing essential inventory processes together in one platform.

The project was built to apply software development concepts in a practical environment, covering frontend development, backend architecture, REST API integration, database persistence, authentication, and cloud deployment.

## Features

- **Dashboard:** Overview of inventory indicators and relevant information.
- **Product Management:** Create, view, update, search, and delete products.
- **Category Management:** Organize products into categories.
- **Supplier Management:** Register and manage supplier information.
- **Purchases:** Manage purchase records.
- **Stock Movements:** Track inventory movements.
- **Authentication:** User registration and secure login using JWT.
- **Profile:** Update personal information and manage profile pictures.
- **Audit:** Access the system's audit records.

## Technologies and Tools

### Programming Language

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

### Backend and APIs

<p align="left">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven"/>
</p>

### Database

<p align="left">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/TiDB_Cloud-DC382D?style=for-the-badge&logo=tidb&logoColor=white" alt="TiDB Cloud"/>
</p>

### Tools and Infrastructure

<p align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render"/>
</p>

## Application Architecture

StockFlow follows a separated frontend and backend architecture.

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

The frontend handles the user interface and communicates with the backend through a REST API.

The backend is responsible for business logic, authentication, data processing, and database operations.

## Accessing the Application

There are two ways to use StockFlow, depending on your goal.

### 1. Live Demo — Hosted Application

<p align="center">
  <a href="https://stock-management-system-two-livid.vercel.app/">
    <img src="https://img.shields.io/badge/OPEN_LIVE_APPLICATION-A9BFFF?style=for-the-badge&logo=vercel&logoColor=black" alt="Open Live Application"/>
  </a>
</p>

The live version is already deployed and available online.

- No installation required.
- No local environment configuration required.
- Access directly through your browser.
- Frontend hosted on Vercel.
- Backend hosted on Render.
- Database hosted on TiDB Cloud.

To use the application, open the link above and create an account through the registration page.

### 2. Local Development — Run on Your Computer

If you want to explore the source code, modify the application, or run your own development environment, follow the instructions below.

#### Prerequisites

- Git
- Node.js and npm
- Java JDK 21
- MySQL-compatible database

#### Clone the Repository

```bash
git clone https://github.com/Carvalho-Eduardo/stock-management-system.git

cd stock-management-system
```

#### Configure and Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure the database connection and the following environment variables:

| Variable | Description |
|---|---|
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

Start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

#### Configure and Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Access the local address provided by Vite, usually:

```text
http://localhost:5173
```

Make sure the frontend is configured to communicate with your locally running backend and that the backend can connect to your database.

#### Additional Frontend Commands

Build the application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The production environment is distributed across three services:

| Service | Platform | Responsibility |
|---|---|---|
| Frontend | Vercel | Web application |
| Backend | Render | REST API |
| Database | TiDB Cloud | Data persistence |

## Security

- JWT-based authentication.
- Protected application resources.
- Environment variables for sensitive configuration.
- Separation of frontend and backend responsibilities.

Never commit real credentials, passwords, or secret keys to the repository.

## Project Goals

StockFlow was developed to strengthen practical software engineering skills through a complete application.

The project covers:

- Frontend development with React.
- REST API development with Spring Boot.
- Database persistence with JPA and Hibernate.
- Authentication and security with JWT.
- Frontend and backend integration.
- Relational database management.
- Version control with Git and GitHub.
- Cloud deployment and environment configuration.

---

## Author

<p align="center">
  <strong>Eduardo Carvalho</strong>
  <br/>
  Software Developer | Systems Analysis and Development Student
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/e-duardo-carvalho/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="mailto:e.duardo.carvalho@outlook.com">
    <img src="https://img.shields.io/badge/Send_an_Email-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white" alt="Email"/>
  </a>
  <a href="https://instagram.com/eduardocarvalho.dev">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"/>
  </a>
</p>

<p align="center">
  <sub>Building knowledge, one project at a time.</sub>
</p>
