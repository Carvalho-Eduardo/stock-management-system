
package com.stockflow.backend.security;

import com.stockflow.backend.model.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtService(
            @Value("${security.jwt.secret}") String segredo,
            @Value("${security.jwt.expiration-ms}") long expiracaoMs
    ) {

        byte[] chaveBytes = Decoders.BASE64.decode(segredo);

        if (chaveBytes.length < 32) {
            throw new IllegalArgumentException(
                    "A chave JWT precisa possuir pelo menos 32 bytes."
            );
        }

        this.chave = Keys.hmacShaKeyFor(chaveBytes);
        this.expiracaoMs = expiracaoMs;
    }

    public String gerarToken(Usuario usuario) {

        Instant agora = Instant.now();

        return Jwts.builder()
                .subject(usuario.getEmail())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plusMillis(expiracaoMs)))
                .signWith(chave)
                .compact();
    }

    public String extrairEmail(String token) {

        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public long getExpiracaoSegundos() {
        return expiracaoMs / 1000;
    }
}
