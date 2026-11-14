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
  "mt-2 w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#101014] px-4 py-3 text-sm text-[#F4F4F5] outline-none transition placeholder:text-[#52525B] focus:border-[#A9BFFF]/60 disabled:cursor-not-allowed disabled:opacity-60";

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
      if (fotoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fotoUrl);
      }
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

      await api.post("/usuarios/me/foto", dados, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setArquivoFoto(null);
      setSucesso("Foto de perfil atualizada com sucesso.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível atualizar sua foto."));
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function removerFoto() {
    if (!window.confirm("Deseja realmente remover sua foto de perfil?")) {
      return;
    }

    setErro("");
    setSucesso("");

    try {
      setSalvandoFoto(true);

      await api.delete("/usuarios/me/foto");

      setFotoUrl("");
      setArquivoFoto(null);

      setSucesso("Foto de perfil removida com sucesso.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível remover sua foto."));
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function salvarSenha(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (!senha.atual || !senha.nova || !senha.confirmar) {
      setErro("Preencha todos os campos de senha.");
      return;
    }

    if (senha.nova.length < 8) {
      setErro("A nova senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    if (senha.nova !== senha.confirmar) {
      setErro("A confirmação da nova senha não corresponde.");
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

      setSucesso("Senha alterada com sucesso.");
    } catch (error) {
      setErro(obterMensagemErro(error, "Não foi possível alterar sua senha."));
    } finally {
      setSalvandoSenha(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#A1A1AA]">
        <LoaderCircle size={19} className="mr-2 animate-spin" />
        Carregando seu perfil...
      </div>
    );
  }

  if (!usuario && erro) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-[#19191D] p-5 sm:p-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0 text-red-300" size={20} />
          <div className="min-w-0">
            <h2 className="font-medium text-white">
              Não foi possível carregar seu perfil
            </h2>
            <p className="mt-2 break-words text-sm text-red-300">{erro}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A9BFFF]">
          Conta / Configurações
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#F4F4F5]">
          Meu perfil
        </h1>

        <p className="mt-1 text-sm text-[#A1A1AA]">
          Gerencie suas informações pessoais, foto e segurança da conta.
        </p>
      </div>

      {(erro || sucesso) && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            erro
              ? "border-red-400/20 bg-red-400/[0.07]"
              : "border-emerald-400/20 bg-emerald-400/[0.07]"
          }`}
        >
          {erro ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
          ) : (
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-300"
            />
          )}

          <p
            className={`min-w-0 break-words text-sm ${
              erro ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {erro || sucesso}
          </p>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="border-b border-white/[0.07] p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-white">Informações pessoais</h2>
              <p className="mt-1 text-xs text-[#71717A]">
                Atualize seus dados de identificação.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={salvarPerfil} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex flex-col items-center gap-3 md:items-start">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#101014] sm:h-32 sm:w-32">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto do perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={42} className="text-[#52525B]" />
                )}
              </div>

              <div className="flex w-full flex-wrap justify-center gap-2 md:justify-start">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#D4D4D8] transition hover:bg-white/[0.05]">
                  <Camera size={14} />
                  Alterar foto
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selecionarFoto}
                    className="hidden"
                  />
                </label>

                {fotoUrl && (
                  <button
                    type="button"
                    onClick={removerFoto}
                    disabled={salvandoFoto}
                    className="flex items-center justify-center gap-2 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Remover
                  </button>
                )}
              </div>

              {arquivoFoto && (
                <div className="w-full space-y-2">
                  <p className="break-all text-center text-xs text-[#A1A1AA] md:text-left">
                    {arquivoFoto.name}
                  </p>

                  <button
                    type="button"
                    onClick={salvarFoto}
                    disabled={salvandoFoto}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#A9BFFF] px-3 py-2.5 text-xs font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] disabled:opacity-50"
                  >
                    {salvandoFoto ? (
                      <LoaderCircle size={14} className="animate-spin" />
                    ) : (
                      <ImagePlus size={14} />
                    )}
                    Salvar foto
                  </button>
                </div>
              )}

              <p className="text-center text-[11px] text-[#71717A] md:text-left">
                JPG, PNG ou WEBP · Máximo 2 MB
              </p>
            </div>

            <div className="min-w-0 space-y-4">
              <div>
                <label className="text-sm text-[#D4D4D8]">Nome completo</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={atualizarCampo}
                  maxLength={150}
                  required
                  className={campo}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="text-sm text-[#D4D4D8]">E-mail</label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-[#71717A]"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={atualizarCampo}
                    maxLength={150}
                    required
                    className={`${campo} pl-10`}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.07] bg-[#101014]/60 p-3">
                  <p className="text-xs text-[#71717A]">Tipo de conta</p>
                  <p className="mt-1 break-words text-sm font-medium text-[#D4D4D8]">
                    {usuario?.tipo || usuario?.role || "Usuário"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#101014]/60 p-3">
                  <p className="text-xs text-[#71717A]">Conta criada em</p>
                  <p className="mt-1 text-sm font-medium text-[#D4D4D8]">
                    {formatarData(usuario?.dataCriacao || usuario?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-stretch border-t border-white/[0.07] pt-4 sm:justify-end">
                <button
                  type="submit"
                  disabled={salvandoPerfil}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A9BFFF] px-5 py-3 text-sm font-semibold text-[#101D2D] transition hover:bg-[#BED0FF] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {salvandoPerfil ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Salvar alterações
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#19191D]">
        <div className="border-b border-white/[0.07] p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A9BFFF]/10 text-[#A9BFFF]">
              <LockKeyhole size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-white">Segurança da conta</h2>
              <p className="mt-1 text-xs text-[#71717A]">
                Altere sua senha de acesso.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={salvarSenha} className="space-y-4 p-4 sm:p-6">
          <div>
            <label className="text-sm text-[#D4D4D8]">Senha atual</label>
            <input
              type="password"
              autoComplete="current-password"
              value={senha.atual}
              onChange={(e) => setSenha({ ...senha, atual: e.target.value })}
              className={campo}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-[#D4D4D8]">Nova senha</label>
              <input
                type="password"
                autoComplete="new-password"
                value={senha.nova}
                onChange={(e) => setSenha({ ...senha, nova: e.target.value })}
                className={campo}
                placeholder="Mínimo de 8 caracteres"
              />
            </div>

            <div>
              <label className="text-sm text-[#D4D4D8]">
                Confirmar nova senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={senha.confirmar}
                onChange={(e) =>
                  setSenha({ ...senha, confirmar: e.target.value })
                }
                className={campo}
                placeholder="Repita a nova senha"
              />
            </div>
          </div>

          <div className="flex justify-stretch border-t border-white/[0.07] pt-4 sm:justify-end">
            <button
              type="submit"
              disabled={salvandoSenha}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-[#D4D4D8] transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {salvandoSenha ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} />
              )}
              Alterar senha
            </button>
          </div>
        </form>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#19191D]/60 p-4">
        <Check size={17} className="mt-0.5 shrink-0 text-[#A9BFFF]" />
        <p className="text-xs leading-relaxed text-[#A1A1AA]">
          Mantenha seus dados atualizados e utilize uma senha segura. Suas
          informações são utilizadas para identificar suas atividades no
          StockFlow.
        </p>
      </div>
    </div>
  );
}
