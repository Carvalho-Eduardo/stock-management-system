import { useLocation } from "react-router-dom";
import { ChevronRight, Bell, UserRound } from "lucide-react";

const titulosPaginas = {
  "/": "Dashboard",
  "/produtos": "Produtos",
  "/categorias": "Categorias",
  "/fornecedores": "Fornecedores",
  "/compras": "Compras",
  "/movimentacoes": "Movimentações",
  "/usuarios": "Usuários",
  "/auditoria": "Auditoria",
};

function Header() {
  const location = useLocation();
  const titulo = titulosPaginas[location.pathname] || "StockFlow";

  return (
    <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-white/[0.06] px-6 sm:px-8">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[11px] text-[#77777F]">
          <span>StockFlow</span>
          <ChevronRight size={12} />
          <span className="text-[#A9BFFF]">{titulo}</span>
        </div>

        <h1 className="text-base font-semibold tracking-tight text-white">
          {titulo}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          type="button"
          title="Notificações"
          aria-label="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#88888F] transition hover:bg-white/[0.06] hover:text-white"
        >
          <Bell size={18} />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-[#E8E8EC]">Usuário</p>
          <p className="mt-1 text-[10px] text-[#77777F]">Administrador</p>
        </div>

        <div
          translate="no"
          title="Perfil do usuário"
          className="notranslate flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#477FFF]/40 bg-[#477FFF]/10 text-[#A9BFFF]"
        >
          <UserRound size={19} strokeWidth={1.8} />
        </div>
      </div>
    </header>
  );
}

export default Header;
