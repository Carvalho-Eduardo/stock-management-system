
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.AuditoriaResponse;
import com.stockflow.backend.service.AuditoriaService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public List<AuditoriaResponse> listarTodas() {
        return auditoriaService.listarTodas();
    }
}
