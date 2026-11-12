
package com.stockflow.backend.service;

import com.stockflow.backend.dto.AuditoriaResponse;
import com.stockflow.backend.model.Auditoria;
import com.stockflow.backend.model.Usuario;
import com.stockflow.backend.repository.AuditoriaRepository;
import com.stockflow.backend.repository.UsuarioRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditoriaService(
            AuditoriaRepository auditoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.auditoriaRepository = auditoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void registrar(
            String acao,
            String modulo,
            Long registroId,
            String descricao
    ) {
        Authentication autenticacao =
                SecurityContextHolder.getContext().getAuthentication();

        if (
                autenticacao == null ||
                !autenticacao.isAuthenticated() ||
                "anonymousUser".equals(autenticacao.getPrincipal())
        ) {
            throw new IllegalStateException(
                    "Não foi possível identificar o usuário responsável pela operação."
            );
        }

        String email = autenticacao.getName();

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Usuário autenticado não encontrado."
                ));

        Auditoria auditoria = new Auditoria();

        auditoria.setUsuario(usuario);
        auditoria.setAcao(acao);
        auditoria.setModulo(modulo);
        auditoria.setRegistroId(registroId);
        auditoria.setDescricao(descricao);

        auditoriaRepository.save(auditoria);
    }

    @Transactional(readOnly = true)
    public List<AuditoriaResponse> listarTodas() {
        return auditoriaRepository.findAllByOrderByDataHoraDesc()
                .stream()
                .map(AuditoriaResponse::new)
                .toList();
    }
}
