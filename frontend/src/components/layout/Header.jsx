import { Link, useLocation } from "react-router-dom";
import { ChevronRight, UserRound } from "lucide-react";

const titulosPaginas = {
  "/": "Dashboard",
  "/produtos": "Produtos",
  "/categorias": "Categorias",
  "/fornecedores": "Fornecedores",
  "/compras": "Compras",
  "/movimentacoes": "Movimentações",
  "/usuarios": "Meu perfil",
  "/auditoria": "Auditoria",
};

function obterUsuario() {
  try {
    return JSON.parse(localStorage.getItem("stockflow_usuario") || "null");
  } catch {
    return null;
  }
}

function Header() {
  const location = useLocation();
  const titulo = titulosPaginas[location.pathname] || "StockFlow";

  const usuario = obterUsuario();
  const nome = usuario?.nome || "Usuário";

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
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-xs font-semibold text-[#E8E8EC]">
            {nome}
          </p>

          <p className="mt-1 text-[10px] text-[#77777F]">Conta pessoal</p>
        </div>

        <Link
          to="/usuarios"
          translate="no"
          title="Acessar meu perfil"
          aria-label="Acessar meu perfil"
          className={`notranslate flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
            location.pathname === "/usuarios"
              ? "border-[#A9BFFF] bg-[#A9BFFF]/20 text-[#A9BFFF]"
              : "border-[#477FFF]/40 bg-[#477FFF]/10 text-[#A9BFFF] hover:border-[#A9BFFF] hover:bg-[#A9BFFF]/20"
          }`}
        >
          <UserRound size={19} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  );
}

export default Header;
