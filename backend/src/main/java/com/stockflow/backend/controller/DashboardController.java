
package com.stockflow.backend.controller;

import com.stockflow.backend.dto.DashboardResponse;
import com.stockflow.backend.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> buscarDados() {

        DashboardResponse dashboard = dashboardService.buscarDados();

        return ResponseEntity.ok(dashboard);
    }
}
