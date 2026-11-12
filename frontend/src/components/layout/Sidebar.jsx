import { NavLink } from "react-router-dom";

import {
  Home,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  ArrowLeftRight,
  ClipboardList,
  Boxes,
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
    itens: [{ nome: "Auditoria", caminho: "/auditoria", icone: ClipboardList }],
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

      <div className="flex w-full shrink-0 items-center justify-center border-t border-white/[0.06] py-5">
        <NavLink
          to="/usuarios"
          title="Meu perfil"
          aria-label="Abrir meu perfil"
          className={({ isActive }) =>
            `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
              isActive
                ? "border-[#A9BFFF] bg-[#A9BFFF]/20 text-[#A9BFFF]"
                : "border-[#A9BFFF]/30 bg-[#A9BFFF]/10 text-[#A9BFFF] hover:border-[#A9BFFF] hover:bg-[#A9BFFF]/20"
            }`
          }
        >
          SF
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
