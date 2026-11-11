import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setErro("");
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

      navigate("/produtos", { replace: true });
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) {
        setErro("E-mail ou senha incorretos.");
      } else if (status === 400) {
        setErro(
          error.response?.data?.message || "Verifique os dados informados.",
        );
      } else if (error.response) {
        setErro(
          error.response.data?.message || "Não foi possível realizar o login.",
        );
      } else {
        setErro(
          "Não foi possível conectar ao servidor. Verifique se o backend está funcionando.",
        );
      }
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
              Bem-vindo de volta
            </h2>

            <p className="mt-2 text-sm text-[#A1A1AA]">
              Entre com suas credenciais para acessar o sistema.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-[#36363D] bg-[#101014] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#62626B] focus:border-[#A9BFFF]"
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
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-[#36363D] bg-[#101014] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#62626B] focus:border-[#A9BFFF]"
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

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-3 text-sm font-semibold text-[#101827] transition hover:bg-[#C0D0FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no sistema
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#71717A]">
          StockFlow · Gerenciamento inteligente de estoque
        </p>
      </div>
    </div>
  );
}

export default Login;
