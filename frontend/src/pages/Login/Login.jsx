
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
  UserRound,
  UserPlus,
  LogIn,
} from "lucide-react";

import api from "../../services/api";

const campo =
  "w-full rounded-xl border border-[#36363D] bg-[#101014] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#62626B] focus:border-[#A9BFFF]";

function Login() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function trocarModo(novoModo) {
    setModo(novoModo);
    setErro("");
    setSucesso("");
  }

  async function handleLogin(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const resposta = await api.post("/usuarios/login", {
        email: email.trim(),
        senha,
      });

      const { token, usuario } = resposta.data;

      if (!token) {
        throw new Error("O servidor não retornou um token de acesso.");
      }

      localStorage.setItem("stockflow_token", token);

      if (usuario) {
        localStorage.setItem("stockflow_usuario", JSON.stringify(usuario));
      }

      navigate("/", { replace: true });
    } catch (error) {
      setErro(
        error.response?.data?.mensagens?.join(" ") ||
          error.response?.data?.message ||
          "Não foi possível realizar o login. Verifique seus dados e tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      await api.post("/usuarios/cadastro", {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      setSucesso("Cadastro realizado! Agora entre com seu e-mail e senha.");
      setModo("login");
      setNome("");
      setSenha("");
    } catch (error) {
      setErro(
        error.response?.data?.mensagens?.join(" ") ||
          error.response?.data?.message ||
          "Não foi possível realizar o cadastro.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090D] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#A9BFFF]/20 bg-[#A9BFFF]/10">
            <Package size={32} className="text-[#A9BFFF]" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Stock<span className="text-[#A9BFFF]">Flow</span>
          </h1>

          <p className="mt-2 text-sm text-[#A1A1AA]">
            Sistema de gerenciamento de estoque
          </p>
        </div>

        <div className="rounded-2xl border border-[#29292D] bg-[#19191D] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              {modo === "login" ? "Bem-vindo de volta" : "Criar conta"}
            </h2>

            <p className="mt-2 text-sm text-[#A1A1AA]">
              {modo === "login"
                ? "Entre com suas credenciais para acessar o sistema."
                : "Crie sua conta gratuita para acessar o StockFlow."}
            </p>
          </div>

          <form
            onSubmit={modo === "login" ? handleLogin : handleCadastro}
            className="space-y-5"
          >
            {modo === "cadastro" && (
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium text-[#D4D4D8]"
                >
                  Nome completo
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]"
                  />

                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Seu nome"
                    className={campo}
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#D4D4D8]"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={180}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className={campo}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-medium text-[#D4D4D8]"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]"
                />

                <input
                  id="senha"
                  type="password"
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                  required
                  minLength={modo === "cadastro" ? 8 : undefined}
                  maxLength={72}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder={
                    modo === "cadastro"
                      ? "Mínimo de 8 caracteres"
                      : "Digite sua senha"
                  }
                  className={campo}
                />
              </div>
            </div>

            {erro && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />
                <p className="text-sm text-red-300">{erro}</p>
              </div>
            )}

            {sucesso && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <Package
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
                <p className="text-sm text-emerald-300">{sucesso}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-sm font-semibold text-[#101827] transition hover:bg-[#C0D0FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  {modo === "login" ? "Entrando..." : "Cadastrando..."}
                </>
              ) : (
                <>
                  {modo === "login" ? "Entrar no sistema" : "Criar minha conta"}
                  {modo === "login" ? (
                    <ArrowRight size={18} />
                  ) : (
                    <UserPlus size={18} />
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
            <p className="text-sm text-[#A1A1AA]">
              {modo === "login"
                ? "Ainda não tem uma conta?"
                : "Já possui uma conta?"}
            </p>

            <button
              type="button"
              onClick={() => trocarModo(modo === "login" ? "cadastro" : "login")}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#A9BFFF] transition hover:text-white"
            >
              {modo === "login" ? (
                <>
                  <UserPlus size={16} />
                  Criar conta
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Voltar para o login
                </>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#71717A]">
          StockFlow · Gerenciamento inteligente de estoque
        </p>
      </div>
    </div>
  );
}

export default Login;
