import { useEffect, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

const campo =
  "mt-2 w-full rounded-xl border border-white/[0.09] bg-[#101014] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/60 disabled:cursor-not-allowed disabled:opacity-60";

function obterMensagemErro(error, mensagemPadrao) {
  return (
    error.response?.data?.mensagens?.join(" ") ||
    error.response?.data?.message ||
    mensagemPadrao
  );
}

function formatarData(valor) {
  if (!valor) return "Não disponível";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "Não disponível";

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Usuarios() {
  const [usuario, setUsuario] = useState(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
  });

  const [senha, setSenha] = useState({
    atual: "",
    nova: "",
    confirmar: "",
  });

  const [fotoUrl, setFotoUrl] = useState("");
  const [arquivoFoto, setArquivoFoto] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get("/usuarios/me");

        if (!ativo) return;

        const dados = resposta.data;

        setUsuario(dados);

        setForm({
          nome: dados.nome || "",
          email: dados.email || "",
        });

        localStorage.setItem("stockflow_usuario", JSON.stringify(dados));

        try {
          const respostaFoto = await api.get("/usuarios/me/foto", {
            responseType: "blob",
          });

          if (ativo && respostaFoto.data.size > 0) {
            setFotoUrl(URL.createObjectURL(respostaFoto.data));
          }
        } catch {
          // A conta pode ainda não possuir uma foto.
        }
      } catch (error) {
        if (ativo) {
          setErro(
            obterMensagemErro(error, "Não foi possível carregar seus dados."),
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!fotoUrl) return undefined;

    return () => {
      URL.revokeObjectURL(fotoUrl);
    };
  }, [fotoUrl]);

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (!form.nome.trim() || !form.email.trim()) {
      setErro("Preencha seu nome e e-mail.");
      return;
    }

    try {
      setSalvandoPerfil(true);

      const resposta = await api.put("/usuarios/me", {
        nome: form.nome.trim(),
        email: form.email.trim(),
      });

      const dados = resposta.data;

      if (dados.token) {
        localStorage.setItem("stockflow_token", dados.token);
      }

      if (dados.usuario) {
        setUsuario(dados.usuario);
        setForm({
          nome: dados.usuario.nome || "",
          email: dados.usuario.email || "",
        });

        localStorage.setItem(
          "stockflow_usuario",
          JSON.stringify(dados.usuario),
        );
      }

      setSucesso("Suas informações foram atualizadas com sucesso.");
    } catch (error) {
      setErro(
        obterMensagemErro(
          error,
          "Não foi possível atualizar suas informações.",
        ),
      );
    } finally {
      setSalvandoPerfil(false);
    }
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    setErro("");
    setSucesso("");

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 2 MB.");
      event.target.value = "";
      return;
    }

    setArquivoFoto(arquivo);
    setFotoUrl(URL.createObjectURL(arquivo));
  }

  async function salvarFoto() {
    if (!arquivoFoto) {
      setErro("Selecione uma imagem antes de salvar.");
      return;
    }

    setErro("");
    setSucesso("");

    try {
      setSalvandoFoto(true);

      const dados = new FormData();
      dados.append("arquivo", arquivoFoto);

      await api.put("/usuarios/me/foto", dados);

      setArquivoFoto(null);

      const resposta = await api.get("/usuarios/me/foto", {
        responseType: "blob",
      });

      setFotoUrl(URL.createObjectURL(resposta.data));

      setSucesso("Sua foto de perfil foi atualizada.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível salvar sua foto."));
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function removerFoto() {
    if (!fotoUrl) return;

    setErro("");
    setSucesso("");

    try {
      setSalvandoFoto(true);

      await api.delete("/usuarios/me/foto");

      setFotoUrl("");
      setArquivoFoto(null);

      setSucesso("Sua foto de perfil foi removida.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível remover sua foto."));
    } finally {
      setSalvandoFoto(false);
    }
  }

  function atualizarSenha(event) {
    const { name, value } = event.target;

    setSenha((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarSenha(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (senha.nova.length < 8) {
      setErro("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (senha.nova !== senha.confirmar) {
      setErro("A confirmação da nova senha não corresponde.");
      return;
    }

    if (senha.atual === senha.nova) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    try {
      setSalvandoSenha(true);

      await api.put("/usuarios/me/senha", {
        senhaAtual: senha.atual,
        novaSenha: senha.nova,
      });

      setSenha({
        atual: "",
        nova: "",
        confirmar: "",
      });

      setSucesso("Sua senha foi alterada com sucesso.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível alterar sua senha."));
    } finally {
      setSalvandoSenha(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-[#A1A1AA]">
        <LoaderCircle size={20} className="animate-spin" />
        Carregando seu perfil...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
            Conta
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
            Meu perfil
          </h1>
        </div>

        <Aviso mensagem={erro || "Não foi possível carregar seu perfil."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
          Conta pessoal
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
          Meu perfil
        </h1>

        <p className="mt-1 text-sm text-[#A1A1AA]">
          Gerencie suas informações pessoais, foto e segurança da conta.
        </p>
      </div>

      {erro && <Aviso mensagem={erro} />}

      {sucesso && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          <p className="text-sm">{sucesso}</p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#19191D]">
        <div className="h-28 bg-gradient-to-r from-[#477FFF]/30 via-[#A9BFFF]/10 to-transparent" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#19191D] bg-[#25252C] text-[#A9BFFF] shadow-xl">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={42} strokeWidth={1.4} />
                )}
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="truncate text-lg font-semibold text-[#F4F4F5]">
                  {usuario.nome}
                </h2>

                <p className="mt-1 truncate text-sm text-[#A1A1AA]">
                  {usuario.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:pb-1">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-[#D4D4D8] transition hover:bg-white/[0.07]">
                <Camera size={15} />
                Escolher foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={selecionarFoto}
                  className="hidden"
                />
              </label>

              {arquivoFoto && (
                <button
                  type="button"
                  onClick={salvarFoto}
                  disabled={salvandoFoto}
                  className="flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-4 py-2.5 text-xs font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] disabled:opacity-60"
                >
                  {salvandoFoto ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  Salvar foto
                </button>
              )}

              {fotoUrl && !arquivoFoto && (
                <button
                  type="button"
                  onClick={removerFoto}
                  disabled={salvandoFoto}
                  title="Remover foto de perfil"
                  className="flex items-center gap-2 rounded-xl border border-red-400/20 px-3 py-2.5 text-xs text-red-300 transition hover:bg-red-400/10 disabled:opacity-60"
                >
                  <Trash2 size={15} />
                  Remover
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 text-xs text-[#71717A]">
            Imagens JPG, PNG ou WEBP. Tamanho máximo: 2 MB.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-white/[0.07] bg-[#19191D] p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#F4F4F5]">
                Informações pessoais
              </h2>

              <p className="mt-1 text-xs text-[#88888F]">
                Atualize os dados da sua conta.
              </p>
            </div>
          </div>

          <form onSubmit={salvarPerfil} className="space-y-5">
            <div>
              <label
                htmlFor="nome"
                className="text-xs font-medium text-[#D4D4D8]"
              >
                Nome completo
              </label>

              <input
                id="nome"
                name="nome"
                type="text"
                autoComplete="name"
                maxLength={120}
                required
                value={form.nome}
                onChange={atualizarCampo}
                className={campo}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-xs font-medium text-[#D4D4D8]"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-[26px] text-[#71717A]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={180}
                  required
                  value={form.email}
                  onChange={atualizarCampo}
                  className={`${campo} pl-11`}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#101014] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#88888F]">
                    Data de criação da conta
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#E4E4E7]">
                    {formatarData(usuario.dataCadastro)}
                  </p>
                </div>

                <CheckCircle2 size={19} className="text-emerald-400" />
              </div>
            </div>

            <div className="flex justify-end border-t border-white/[0.06] pt-5">
              <button
                type="submit"
                disabled={salvandoPerfil}
                className="flex items-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoPerfil ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Salvar informações
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-[#19191D] p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <LockKeyhole size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#F4F4F5]">
                Segurança da conta
              </h2>

              <p className="mt-1 text-xs text-[#88888F]">
                Altere sua senha de acesso.
              </p>
            </div>
          </div>

          <form onSubmit={salvarSenha} className="space-y-4">
            <div>
              <label
                htmlFor="senhaAtual"
                className="text-xs font-medium text-[#D4D4D8]"
              >
                Senha atual
              </label>

              <input
                id="senhaAtual"
                name="atual"
                type="password"
                autoComplete="current-password"
                required
                maxLength={72}
                value={senha.atual}
                onChange={atualizarSenha}
                className={campo}
                placeholder="Digite sua senha atual"
              />
            </div>

            <div>
              <label
                htmlFor="novaSenha"
                className="text-xs font-medium text-[#D4D4D8]"
              >
                Nova senha
              </label>

              <input
                id="novaSenha"
                name="nova"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={senha.nova}
                onChange={atualizarSenha}
                className={campo}
                placeholder="Mínimo de 8 caracteres"
              />
            </div>

            <div>
              <label
                htmlFor="confirmarSenha"
                className="text-xs font-medium text-[#D4D4D8]"
              >
                Confirmar nova senha
              </label>

              <input
                id="confirmarSenha"
                name="confirmar"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={senha.confirmar}
                onChange={atualizarSenha}
                className={campo}
                placeholder="Digite novamente a nova senha"
              />
            </div>

            <div className="rounded-xl border border-[#A9BFFF]/10 bg-[#A9BFFF]/[0.04] p-3">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#A9BFFF]"
                />

                <p className="text-xs leading-relaxed text-[#A1A1AA]">
                  Sua senha é armazenada de forma criptografada e nunca é
                  exibida no perfil.
                </p>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/[0.06] pt-5">
              <button
                type="submit"
                disabled={salvandoSenha}
                className="flex items-center gap-2 rounded-xl border border-[#A9BFFF]/20 bg-[#A9BFFF]/10 px-5 py-3 text-sm font-semibold text-[#C7D5FF] transition hover:bg-[#A9BFFF]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvandoSenha ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                Atualizar senha
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#19191D]/60 p-4">
        <ImagePlus size={19} className="mt-0.5 shrink-0 text-[#A9BFFF]" />

        <div>
          <p className="text-sm font-medium text-[#E4E4E7]">
            Seu perfil no StockFlow
          </p>

          <p className="mt-1 text-xs leading-relaxed text-[#88888F]">
            Suas informações são pessoais e somente você pode atualizar os dados
            e a foto da sua própria conta.
          </p>
        </div>
      </section>
    </div>
  );
}

function Aviso({ mensagem }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-red-300">
      <AlertCircle size={17} className="mt-0.5 shrink-0" />
      <p className="text-sm">{mensagem}</p>
    </div>
  );
}
