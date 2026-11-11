import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import PlaceholderPage from "./components/ui/PlaceholderPage";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Produtos = lazy(() => import("./pages/Produtos/Produtos"));
const Login = lazy(() => import("./pages/Login/Login"));

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
              <PlaceholderPage
                titulo="Categorias"
                descricao="Organize os produtos por categorias."
              />
            }
          />

          <Route
            path="/fornecedores"
            element={
              <PlaceholderPage
                titulo="Fornecedores"
                descricao="Gerencie os fornecedores do sistema."
              />
            }
          />

          <Route
            path="/compras"
            element={
              <PlaceholderPage
                titulo="Compras"
                descricao="Acompanhe e gerencie as compras realizadas."
              />
            }
          />

          <Route
            path="/movimentacoes"
            element={
              <PlaceholderPage
                titulo="Movimentações"
                descricao="Consulte as entradas e saídas do estoque."
              />
            }
          />

          <Route
            path="/usuarios"
            element={
              <PlaceholderPage
                titulo="Usuários"
                descricao="Gerencie os usuários e suas permissões."
              />
            }
          />

          <Route
            path="/auditoria"
            element={
              <PlaceholderPage
                titulo="Auditoria"
                descricao="Consulte o histórico de ações realizadas no sistema."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
