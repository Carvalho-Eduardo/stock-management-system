
package com.stockflow.backend.service;

import com.stockflow.backend.dto.CadastroUsuarioRequest;
import com.stockflow.backend.dto.LoginRequest;
import com.stockflow.backend.dto.LoginResponse;
import com.stockflow.backend.dto.UsuarioResponse;

import com.stockflow.backend.model.Usuario;

import com.stockflow.backend.repository.UsuarioRepository;

import com.stockflow.backend.security.JwtService;

import org.springframework.http.HttpStatus;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UsuarioResponse cadastrar(CadastroUsuarioRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome().trim());
        usuario.setEmail(email);

        // Criptografa a senha antes de salvar.
        usuario.setSenha(
                passwordEncoder.encode(request.getSenha())
        );

        // Cadastro público nunca concede perfil administrativo.
        usuario.setPerfil("OPERADOR");

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(usuarioSalvo);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha incorretos."
                ));

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

        // Gera o token JWT.
        String token = jwtService.gerarToken(usuario);

        // Retorna token e dados do usuário.
        return new LoginResponse(
                token,
                jwtService.getExpiracaoSegundos(),
                new UsuarioResponse(usuario)
        );
    }
}
