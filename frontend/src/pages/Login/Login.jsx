import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const atualizarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setErro("");
    setSucesso("");
  };

  const alternarModo = () => {
    setModoCadastro((anterior) => !anterior);
    setErro("");
    setSucesso("");

    setFormulario({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    });
  };

  const tratarErro = (error) => {
    const dados = error?.response?.data;

    if (typeof dados === "string" && dados.trim()) return dados;
    if (dados?.message) return dados.message;
    if (dados?.mensagem) return dados.mensagem;
    if (dados?.erro) return dados.erro;

    if (error?.response?.status === 401) {
      return "E-mail ou senha incorretos.";
    }

    if (error?.response?.status === 409) {
      return "Já existe uma conta cadastrada com este e-mail.";
    }

    if (error?.response?.status === 400) {
      return "Verifique os dados informados e tente novamente.";
    }

    return "Não foi possível concluir a operação. Tente novamente.";
  };

  const validarFormulario = () => {
    if (!formulario.email.trim()) {
      return "Informe seu e-mail.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim())) {
      return "Informe um endereço de e-mail válido.";
    }

    if (!formulario.senha) {
      return "Informe sua senha.";
    }

    if (modoCadastro) {
      if (!formulario.nome.trim()) {
        return "Informe seu nome.";
      }

      if (formulario.nome.trim().length < 3) {
        return "O nome deve possuir pelo menos 3 caracteres.";
      }

      if (formulario.senha.length < 6) {
        return "A senha deve possuir pelo menos 6 caracteres.";
      }

      if (formulario.senha !== formulario.confirmarSenha) {
        return "As senhas não coincidem.";
      }
    }

    return "";
  };

  const entrar = async (evento) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    const mensagemValidacao = validarFormulario();

    if (mensagemValidacao) {
      setErro(mensagemValidacao);
      return;
    }

    setCarregando(true);

    try {
      if (modoCadastro) {
        await api.post("/usuarios/cadastro", {
          nome: formulario.nome.trim(),
          email: formulario.email.trim(),
          senha: formulario.senha,
        });

        setSucesso("Cadastro realizado! Faça login para continuar.");
        setModoCadastro(false);

        setFormulario((anterior) => ({
          ...anterior,
          nome: "",
          senha: "",
          confirmarSenha: "",
        }));

        return;
      }

      const resposta = await api.post("/usuarios/login", {
        email: formulario.email.trim(),
        senha: formulario.senha,
      });

      const token =
        resposta.data?.token ||
        resposta.data?.accessToken ||
        resposta.data?.jwt;

      if (!token) {
        throw new Error("A resposta do servidor não contém um token válido.");
      }

      localStorage.setItem("stockflow_token", token);

      const usuario =
        resposta.data?.usuario ||
        resposta.data?.user ||
        resposta.data?.dados ||
        {};

      localStorage.setItem("stockflow_usuario", JSON.stringify(usuario));

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErro(tratarErro(error));
    } finally {
      setCarregando(false);
    }
  };

  const campo =
    "w-full rounded-xl border border-white/[0.08] bg-[#101014] px-4 py-3 pl-11 text-base sm:text-sm text-white outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/50 focus:ring-2 focus:ring-[#A9BFFF]/10";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090D] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#A9BFFF]/20 bg-[#A9BFFF]/10">
            <LockKeyhole size={30} className="text-[#A9BFFF]" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            StockFlow
          </h1>

          <p className="mt-2 text-sm text-[#A1A1AA]">
            Gestão inteligente de estoque
          </p>
        </div>

        <div className="rounded-2xl border border-[#29292D] bg-[#19191D] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-semibold text-white">
              {modoCadastro ? "Criar sua conta" : "Bem-vindo de volta"}
            </h2>

            <p className="mt-2 text-sm text-[#A1A1AA]">
              {modoCadastro
                ? "Preencha os dados para começar a utilizar o StockFlow."
                : "Entre com suas credenciais para acessar o sistema."}
            </p>
          </div>

          <form onSubmit={entrar} className="space-y-5">
            {modoCadastro && (
              <div>
                <label className="mb-2 block text-sm text-[#D4D4D8]">
                  Nome completo
                </label>

                <div className="relative">
                  <UserPlus
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]"
                  />

                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) => atualizarCampo("nome", e.target.value)}
                    placeholder="Seu nome"
                    maxLength={150}
                    autoComplete="name"
                    className={campo}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-[#D4D4D8]">
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]"
                />

                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => atualizarCampo("email", e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className={campo}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#D4D4D8]">Senha</label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]"
                />

                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={formulario.senha}
                  onChange={(e) => atualizarCampo("senha", e.target.value)}
                  placeholder="Sua senha"
                  autoComplete={
                    modoCadastro ? "new-password" : "current-password"
                  }
                  className={`${campo} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((anterior) => !anterior)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] transition hover:text-white"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {modoCadastro && (
              <div>
                <label className="mb-2 block text-sm text-[#D4D4D8]">
                  Confirmar senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]"
                  />

                  <input
                    type={mostrarConfirmacao ? "text" : "password"}
                    value={formulario.confirmarSenha}
                    onChange={(e) =>
                      atualizarCampo("confirmarSenha", e.target.value)
                    }
                    placeholder="Digite sua senha novamente"
                    autoComplete="new-password"
                    className={`${campo} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarConfirmacao((anterior) => !anterior)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717A] transition hover:text-white"
                    aria-label={
                      mostrarConfirmacao
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                  >
                    {mostrarConfirmacao ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {erro && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-400"
                />
                <p className="text-sm text-red-300">{erro}</p>
              </div>
            )}

            {sucesso && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
                <p className="text-sm text-emerald-300">{sucesso}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BDD0FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Aguarde...
                </>
              ) : modoCadastro ? (
                "Criar conta"
              ) : (
                "Entrar no sistema"
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
            <p className="text-sm text-[#A1A1AA]">
              {modoCadastro
                ? "Já possui uma conta?"
                : "Ainda não possui uma conta?"}
            </p>

            <button
              type="button"
              onClick={alternarModo}
              className="mt-2 text-sm font-medium text-[#A9BFFF] transition hover:text-white"
            >
              {modoCadastro ? "Voltar para o login" : "Criar uma conta"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#52525B]">
          StockFlow · Sistema de Gestão de Estoque
        </p>
      </div>
    </div>
  );
}

export default Login;
