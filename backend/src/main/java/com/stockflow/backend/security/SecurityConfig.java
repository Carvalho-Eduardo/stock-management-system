
package com.stockflow.backend.security;

import com.stockflow.backend.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public SecurityConfig(
            JwtService jwtService,
            UsuarioRepository usuarioRepository
    ) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        JwtAuthenticationFilter jwtFilter =
                new JwtAuthenticationFilter(
                        jwtService,
                        usuarioRepository
                );

        http
                .csrf(csrf -> csrf.disable())

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Cadastro e login são públicos.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/usuarios/cadastro",
                                "/api/usuarios/login"
                        ).permitAll()

                        // Tratamento de erros.
                        .requestMatchers("/error").permitAll()

                        // Gerenciamento de usuários: administrador.
                        .requestMatchers("/api/usuarios/**")
                        .hasRole("ADMINISTRADOR")

                        // Operadores também podem movimentar estoque.
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/movimentacoes/entrada",
                                "/api/movimentacoes/saida"
                        ).hasAnyRole("ADMINISTRADOR", "OPERADOR")

                        // Outras operações de escrita: administrador.
                        .requestMatchers(HttpMethod.POST, "/api/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.PUT, "/api/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.PATCH, "/api/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.DELETE, "/api/**")
                        .hasRole("ADMINISTRADOR")

                        // Qualquer outra rota exige autenticação.
                        .anyRequest().authenticated()
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint((request, response, ex) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED,
                                    "Autenticação necessária."
                            );
                        })

                        .accessDeniedHandler((request, response, ex) -> {
                            response.sendError(
                                    HttpServletResponse.SC_FORBIDDEN,
                                    "Você não possui permissão para acessar este recurso."
                            );
                        })
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

    