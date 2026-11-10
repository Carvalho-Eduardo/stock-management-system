
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.CadastroUsuarioRequest;
import com.stockflow.backend.dto.LoginRequest;
import com.stockflow.backend.dto.UsuarioResponse;
import com.stockflow.backend.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        UsuarioResponse usuario = usuarioService.cadastrar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        UsuarioResponse usuario = usuarioService.login(request);

        return ResponseEntity.ok(usuario);
    }
}
