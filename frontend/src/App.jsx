
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Produtos = lazy(() => import("./pages/Produtos/Produtos"));
const Categorias = lazy(() => import("./pages/Categorias/Categorias"));
const Fornecedores = lazy(() => import("./pages/Fornecedores/Fornecedores"));
const Login = lazy(() => import("./pages/Login/Login"));
const Compras = lazy(() => import("./pages/Compras/Compras"));
const Movimentacoes = lazy(() => import("./pages/Movimentacoes/Movimentacoes"));
const Usuarios = lazy(() => import("./pages/Usuarios/Usuarios"));
const Auditoria = lazy(() => import("./pages/Auditoria/Auditoria"));

function Carregamento() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#29292D] border-t-[#A9BFFF]" />

        <p className="text-xs text-[#A1A1AA]">
          Carregando página...
        </p>
      </div>
    </div>
  );
}

// Protege todas as páginas que exigem autenticação.
function RotaProtegida({ children }) {
  const token = localStorage.getItem("stockflow_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública de login */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<Carregamento />}>
              <Login />
            </Suspense>
          }
        />

        {/* Todas as páginas abaixo exigem autenticação */}
        <Route
          element={
            <RotaProtegida>
              <MainLayout />
            </RotaProtegida>
          }
        >
          <Route
            path="/"
            element={
              <Suspense fallback={<Carregamento />}>
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/produtos"
            element={
              <Suspense fallback={<Carregamento />}>
                <Produtos />
              </Suspense>
            }
          />

          <Route
            path="/categorias"
            element={
              <Suspense fallback={<Carregamento />}>
                <Categorias />
              </Suspense>
            }
          />

          <Route
            path="/fornecedores"
            element={
              <Suspense fallback={<Carregamento />}>
                <Fornecedores />
              </Suspense>
            }
          />

          <Route
            path="/compras"
            element={
              <Suspense fallback={<Carregamento />}>
                <Compras />
              </Suspense>
            }
          />

          <Route
            path="/movimentacoes"
            element={
              <Suspense fallback={<Carregamento />}>
                <Movimentacoes />
              </Suspense>
            }
          />

          <Route
            path="/usuarios"
            element={
              <Suspense fallback={<Carregamento />}>
                <Usuarios />
              </Suspense>
            }
          />

          <Route
            path="/auditoria"
            element={
              <Suspense fallback={<Carregamento />}>
                <Auditoria />
              </Suspense>
            }
          />
        </Route>

        {/* Redireciona endereços desconhecidos */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
