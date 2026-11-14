import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, UserRound, Menu, Home } from "lucide-react";

import api from "../../services/api";

const titulosPaginas = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
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

function Header({ onMenuClick }) {
  const location = useLocation();
  const titulo = titulosPaginas[location.pathname] || "StockFlow";

  const usuario = obterUsuario();
  const nome = usuario?.nome || "Usuário";

  const [fotoUrl, setFotoUrl] = useState("");

  useEffect(() => {
    let ativo = true;
    let urlAtual = "";

    async function carregarFoto() {
      try {
        const resposta = await api.get("/usuarios/me/foto", {
          responseType: "blob",
        });

        if (!ativo || !resposta.data || resposta.data.size === 0) {
          return;
        }

        const novaUrl = URL.createObjectURL(resposta.data);

        if (urlAtual) {
          URL.revokeObjectURL(urlAtual);
        }

        urlAtual = novaUrl;
        setFotoUrl(novaUrl);
      } catch {
        if (ativo) {
          setFotoUrl("");
        }
      }
    }

    function atualizarFoto() {
      carregarFoto();
    }

    carregarFoto();

    window.addEventListener("stockflow:foto-atualizada", atualizarFoto);

    return () => {
      ativo = false;

      window.removeEventListener("stockflow:foto-atualizada", atualizarFoto);

      if (urlAtual) {
        URL.revokeObjectURL(urlAtual);
      }
    };
  }, []);

  return (
    <header className="flex min-h-[68px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 sm:min-h-[76px] sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          to="/"
          aria-label="Ir para o início"
          title="Início"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#A9BFFF] transition hover:bg-white/[0.06] hover:text-white md:hidden"
        >
          <Home size={20} strokeWidth={1.9} />
        </Link>

        <div className="min-w-0">
          <div className="mb-1 hidden items-center gap-2 text-[11px] text-[#77777F] sm:flex">
            <span>StockFlow</span>
            <ChevronRight size={12} />
            <span className="text-[#A9BFFF]">{titulo}</span>
          </div>

          <p className="truncate text-base font-semibold tracking-tight text-white">
            {titulo}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu de navegação"
          aria-haspopup="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#A1A1AA] transition hover:bg-white/[0.06] hover:text-white md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden text-right md:block">
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
          className={`notranslate hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border transition md:flex ${
            location.pathname === "/usuarios"
              ? "border-[#A9BFFF] bg-[#A9BFFF]/20 text-[#A9BFFF]"
              : "border-[#477FFF]/40 bg-[#477FFF]/10 text-[#A9BFFF] hover:border-[#A9BFFF] hover:bg-[#A9BFFF]/20"
          }`}
        >
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Foto do perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={19} strokeWidth={1.8} />
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
