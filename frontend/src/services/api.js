import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

// Adiciona o token de autenticação às requisições.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("stockflow_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Padroniza as mensagens e trata sessões expiradas.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const dados = error.response.data;

      if (typeof dados === "string" && dados.trim()) {
        error.response.data = {
          message: dados,
        };
      } else if (dados && typeof dados === "object") {
        let mensagem = "";

        if (Array.isArray(dados.mensagens) && dados.mensagens.length) {
          mensagem = dados.mensagens
            .filter((item) => typeof item === "string" && item.trim())
            .join(" ");
        } else {
          mensagem =
            dados.message ||
            dados.detail ||
            dados.mensagem ||
            dados.error ||
            "";
        }

        if (mensagem) {
          error.response.data = {
            ...dados,
            message: mensagem,
          };
        }
      }

      const status = error.response.status;
      const urlRequisicao = (error.config?.url || "")
        .split("?")[0]
        .replace(/\/+$/, "");

      // Não trata erros de autenticação como sessão expirada.
      const requisicaoDeLogin =
        urlRequisicao.endsWith("/usuarios/login") ||
        urlRequisicao.endsWith("/usuarios/cadastro");

      // Encerra a sessão quando o backend rejeita um token.
      if (
        status === 401 &&
        !requisicaoDeLogin &&
        localStorage.getItem("stockflow_token")
      ) {
        localStorage.removeItem("stockflow_token");
        localStorage.removeItem("stockflow_usuario");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      if (!error.response.data?.message) {
        const mensagensPorStatus = {
          400: "Os dados enviados são inválidos. Verifique os campos e tente novamente.",
          401: "Sua sessão expirou ou não está autenticada. Entre novamente no sistema.",
          403: "Você não possui permissão para realizar esta operação.",
          404: "O registro solicitado não foi encontrado.",
          409: "Não foi possível concluir a operação porque existe um conflito com outro registro.",
          422: "Os dados informados não puderam ser processados.",
          500: "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
          503: "O servidor está temporariamente indisponível.",
        };

        error.response.data = {
          ...error.response.data,
          message:
            mensagensPorStatus[status] ||
            "Não foi possível concluir a operação. Entre em contato com o suporte.",
        };
      }
    } else {
      error.response = {
        data: {
          message:
            "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
        },
      };
    }

    return Promise.reject(error);
  },
);

export default api;
