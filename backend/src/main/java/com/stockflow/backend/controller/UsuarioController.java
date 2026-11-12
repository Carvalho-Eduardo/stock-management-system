
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.AlterarSenhaRequest;
import com.stockflow.backend.dto.AtualizarPerfilRequest;
import com.stockflow.backend.dto.CadastroUsuarioRequest;
import com.stockflow.backend.dto.FotoPerfilResponse;
import com.stockflow.backend.dto.LoginRequest;
import com.stockflow.backend.dto.LoginResponse;
import com.stockflow.backend.dto.UsuarioResponse;
import com.stockflow.backend.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<UsuarioResponse> cadastrar(
            @Valid @RequestBody CadastroUsuarioRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuarioService.cadastrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(usuarioService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> meuPerfil(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                usuarioService.buscarMeuPerfil(authentication.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<LoginResponse> atualizarMeuPerfil(
            @Valid @RequestBody AtualizarPerfilRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                usuarioService.atualizarMeuPerfil(
                        request,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/me/senha")
    public ResponseEntity<Void> alterarMinhaSenha(
            @Valid @RequestBody AlterarSenhaRequest request,
            Authentication authentication
    ) {
        usuarioService.alterarMinhaSenha(
                request,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @PutMapping(
            value = "/me/foto",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> salvarFotoPerfil(
            @RequestParam("arquivo") MultipartFile arquivo,
            Authentication authentication
    ) {
        usuarioService.salvarFotoPerfil(
                arquivo,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/foto")
    public ResponseEntity<byte[]> buscarFotoPerfil(
            Authentication authentication
    ) {
        FotoPerfilResponse foto = usuarioService.buscarFotoPerfil(
                authentication.getName()
        );

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(foto.getTipo()))
                .cacheControl(CacheControl.noCache())
                .body(foto.getConteudo());
    }

    @DeleteMapping("/me/foto")
    public ResponseEntity<Void> removerFotoPerfil(
            Authentication authentication
    ) {
        usuarioService.removerFotoPerfil(authentication.getName());

        return ResponseEntity.noContent().build();
    }
}
