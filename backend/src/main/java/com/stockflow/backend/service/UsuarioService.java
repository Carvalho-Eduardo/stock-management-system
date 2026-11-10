
package com.stockflow.backend.service;

import com.stockflow.backend.dto.CadastroUsuarioRequest;
import com.stockflow.backend.dto.LoginRequest;
import com.stockflow.backend.dto.UsuarioResponse;
import com.stockflow.backend.model.Usuario;
import com.stockflow.backend.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional
    public UsuarioResponse cadastrar(CadastroUsuarioRequest request) {

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome().trim());
        usuario.setEmail(email);

        // A senha é criptografada antes de ser salva no banco.
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));

        usuario.setPerfil("ADMINISTRADOR");

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(usuarioSalvo);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha incorretos."
                ));

        // Compara a senha recebida com a senha criptografada do banco.
        boolean senhaCorreta = passwordEncoder.matches(
                request.getSenha(),
                usuario.getSenha()
        );

        if (!senhaCorreta) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "E-mail ou senha incorretos."
            );
        }

        return new UsuarioResponse(usuario);
    }
}
