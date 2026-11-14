import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Home,
  Package,
  ArrowLeftRight,
  X,
  Tags,
  Truck,
  ShoppingCart,
  ClipboardList,
  UserRound,
  Boxes,
} from "lucide-react";

const atalhos = [
  { nome: "Início", caminho: "/", icone: Home },
  { nome: "Produtos", caminho: "/produtos", icone: Package },
  {
    nome: "Movimentações",
    caminho: "/movimentacoes",
    icone: ArrowLeftRight,
  },
  { nome: "Perfil", caminho: "/usuarios", icone: UserRound },
];

const paginas = [
  { nome: "Dashboard", caminho: "/", icone: Home },
  { nome: "Produtos", caminho: "/produtos", icone: Package },
  { nome: "Categorias", caminho: "/categorias", icone: Tags },
  { nome: "Fornecedores", caminho: "/fornecedores", icone: Truck },
  { nome: "Compras", caminho: "/compras", icone: ShoppingCart },
  {
    nome: "Movimentações",
    caminho: "/movimentacoes",
    icone: ArrowLeftRight,
  },
  { nome: "Auditoria", caminho: "/auditoria", icone: ClipboardList },
  { nome: "Meu perfil", caminho: "/usuarios", icone: UserRound },
];

function MobileNavigation({ menuAberto, onFechar }) {
  const location = useLocation();

  useEffect(() => {
    onFechar();
  }, [location.pathname, onFechar]);

  useEffect(() => {
    if (!menuAberto) return undefined;

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        onFechar();
      }
    }

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto, onFechar]);

  return (
    <>
      {menuAberto && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onFechar}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="absolute right-0 top-0 flex h-full w-[min(86%,340px)] flex-col border-l border-white/[0.08] bg-[#19191D] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9BFFF] text-[#09090D]">
                  <Boxes size={21} />
                </div>

                <div>
                  <p className="font-semibold text-white">StockFlow</p>
                  <p className="text-xs text-[#88888F]">Navegação</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar menu"
                className="rounded-lg p-2 text-[#A1A1AA] transition hover:bg-white/[0.06] hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <p className="px-3 pb-3 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77777F]">
                Todas as páginas
              </p>

              {paginas.map((item) => {
                const Icone = item.icone;

                return (
                  <NavLink
                    key={item.caminho}
                    to={item.caminho}
                    end={item.caminho === "/"}
                    onClick={onFechar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                        isActive
                          ? "bg-[#A9BFFF]/15 text-[#A9BFFF]"
                          : "text-[#A1A1AA] hover:bg-white/[0.05] hover:text-white"
                      }`
                    }
                  >
                    <Icone size={19} strokeWidth={1.8} />
                    <span>{item.nome}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-white/[0.07] p-5">
              <p className="text-center text-[11px] text-[#71717A]">
                StockFlow · Gestão de estoque
              </p>
            </div>
          </aside>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#19191D]/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {atalhos.map((item) => {
            const Icone = item.icone;

            return (
              <NavLink
                key={item.caminho}
                to={item.caminho}
                end={item.caminho === "/"}
                aria-label={item.nome === "Perfil" ? "Meu perfil" : item.nome}
                title={item.nome}
                className={({ isActive }) =>
                  `flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition ${
                    isActive
                      ? "text-[#A9BFFF]"
                      : "text-[#88888F] hover:text-white"
                  }`
                }
              >
                <Icone size={21} strokeWidth={1.8} />
                <span>{item.nome}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default MobileNavigation;
