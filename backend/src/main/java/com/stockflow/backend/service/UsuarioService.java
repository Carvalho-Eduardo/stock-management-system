
package com.stockflow.backend.service;

import com.stockflow.backend.dto.AlterarSenhaRequest;
import com.stockflow.backend.dto.AtualizarPerfilRequest;
import com.stockflow.backend.dto.CadastroUsuarioRequest;
import com.stockflow.backend.dto.FotoPerfilResponse;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Locale;
import java.util.Set;

@Service
public class UsuarioService {

    private static final long TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024;

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

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

        String email = normalizarEmail(request.getEmail());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setPerfil("USUARIO");
        usuario.setAtivo(true);

        return new UsuarioResponse(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = normalizarEmail(request.getEmail());

        Usuario usuario = usuarioRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha incorretos."
                ));

        if (!usuario.isAtivo()
                || !passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "E-mail ou senha incorretos."
            );
        }

        String token = jwtService.gerarToken(usuario);

        return new LoginResponse(
                token,
                jwtService.getExpiracaoSegundos(),
                new UsuarioResponse(usuario)
        );
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarMeuPerfil(String emailAutenticado) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        return new UsuarioResponse(usuario);
    }

    @Transactional
    public LoginResponse atualizarMeuPerfil(
            AtualizarPerfilRequest request,
            String emailAutenticado
    ) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        String novoEmail = normalizarEmail(request.getEmail());

        if (usuarioRepository.existsByEmailIgnoreCaseAndIdNot(
                novoEmail,
                usuario.getId()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está sendo utilizado por outra conta."
            );
        }

        usuario.setNome(request.getNome().trim());
        usuario.setEmail(novoEmail);

        Usuario atualizado = usuarioRepository.save(usuario);

        // Emite um novo JWT caso o e-mail tenha sido alterado.
        String novoToken = jwtService.gerarToken(atualizado);

        return new LoginResponse(
                novoToken,
                jwtService.getExpiracaoSegundos(),
                new UsuarioResponse(atualizado)
        );
    }

    @Transactional
    public void alterarMinhaSenha(
            AlterarSenhaRequest request,
            String emailAutenticado
    ) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        if (!passwordEncoder.matches(
                request.getSenhaAtual(),
                usuario.getSenha()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha atual está incorreta."
            );
        }

        if (passwordEncoder.matches(
                request.getNovaSenha(),
                usuario.getSenha()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A nova senha deve ser diferente da senha atual."
            );
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));

        usuarioRepository.save(usuario);
    }

    @Transactional
    public void salvarFotoPerfil(
            MultipartFile arquivo,
            String emailAutenticado
    ) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        if (arquivo == null || arquivo.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione uma imagem para enviar."
            );
        }

        if (arquivo.getSize() > TAMANHO_MAXIMO_FOTO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A imagem deve ter no máximo 2 MB."
            );
        }

        String tipo = arquivo.getContentType();

        if (tipo == null || !TIPOS_PERMITIDOS.contains(tipo.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Formato não permitido. Utilize JPG, PNG ou WEBP."
            );
        }

        try {
            usuario.setFotoPerfil(arquivo.getBytes());
            usuario.setFotoPerfilTipo(tipo.toLowerCase(Locale.ROOT));

            usuarioRepository.save(usuario);

        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível salvar a imagem."
            );
        }
    }

    @Transactional(readOnly = true)
    public FotoPerfilResponse buscarFotoPerfil(String emailAutenticado) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        if (usuario.getFotoPerfil() == null
                || usuario.getFotoPerfil().length == 0
                || usuario.getFotoPerfilTipo() == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Este usuário ainda não possui foto de perfil."
            );
        }

        return new FotoPerfilResponse(
                usuario.getFotoPerfil(),
                usuario.getFotoPerfilTipo()
        );
    }

    @Transactional
    public void removerFotoPerfil(String emailAutenticado) {

        Usuario usuario = buscarUsuarioAutenticado(emailAutenticado);

        usuario.setFotoPerfil(null);
        usuario.setFotoPerfilTipo(null);

        usuarioRepository.save(usuario);
    }

    private Usuario buscarUsuarioAutenticado(String email) {

        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuário autenticado não encontrado."
                ));
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
