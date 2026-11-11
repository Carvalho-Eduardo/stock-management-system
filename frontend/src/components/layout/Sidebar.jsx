import { NavLink } from "react-router-dom";

import {
  Home,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  ArrowLeftRight,
  Users,
  ClipboardList,
  Boxes,
  Bell,
} from "lucide-react";

const grupos = [
  {
    titulo: "GERAL",
    itens: [{ nome: "Dashboard", caminho: "/", icone: Home }],
  },
  {
    titulo: "ESTOQUE",
    itens: [
      { nome: "Produtos", caminho: "/produtos", icone: Package },
      { nome: "Categorias", caminho: "/categorias", icone: Tags },
      { nome: "Fornecedores", caminho: "/fornecedores", icone: Truck },
      { nome: "Compras", caminho: "/compras", icone: ShoppingCart },
      {
        nome: "Movimentações",
        caminho: "/movimentacoes",
        icone: ArrowLeftRight,
      },
    ],
  },
  {
    titulo: "SISTEMA",
    itens: [
      { nome: "Usuários", caminho: "/usuarios", icone: Users },
      { nome: "Auditoria", caminho: "/auditoria", icone: ClipboardList },
    ],
  },
];

function Sidebar() {
  return (
    <aside className="flex h-full w-[76px] shrink-0 flex-col items-center overflow-hidden border-r border-white/[0.06] bg-[#19191D]">
      <NavLink
        to="/"
        aria-label="StockFlow - Início"
        title="StockFlow"
        className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A9BFFF] text-[#09090D] transition hover:bg-white"
      >
        <Boxes size={24} strokeWidth={2.4} />
      </NavLink>

      <nav className="mt-10 flex w-full min-h-0 flex-1 flex-col items-center gap-7 overflow-y-auto overflow-x-hidden px-2 pb-4">
        {grupos.map((grupo) => (
          <div
            key={grupo.titulo}
            className="flex w-full shrink-0 flex-col items-center gap-2"
          >
            {grupo.itens.map((item) => {
              const Icone = item.icone;

              return (
                <NavLink
                  key={item.caminho}
                  to={item.caminho}
                  end={item.caminho === "/"}
                  title={item.nome}
                  aria-label={item.nome}
                  className={({ isActive }) =>
                    `relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#A9BFFF]/30 to-[#A9BFFF]/5 text-white before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-r before:bg-[#A9BFFF]"
                        : "text-[#88888F] hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  <Icone size={19} strokeWidth={1.8} />
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex w-full shrink-0 flex-col items-center gap-4 border-t border-white/[0.06] py-5">
        <button
          type="button"
          title="Notificações"
          aria-label="Notificações"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#88888F] transition hover:bg-white/[0.06] hover:text-white"
        >
          <Bell size={19} strokeWidth={1.8} />
        </button>

        <div
          translate="no"
          title="StockFlow"
          className="notranslate flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A9BFFF]/30 bg-[#A9BFFF]/10 text-xs font-semibold text-[#A9BFFF]"
        >
          SF
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
