import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

        <p className="text-xs text-[#A1A1AA]">Carregando página...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Carregamento />}>
              <Login />
            </Suspense>
          }
        />

        <Route element={<MainLayout />}>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
