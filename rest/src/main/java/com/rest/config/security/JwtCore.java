package com.rest.config.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;

@Component
public class JwtCore {

    @Value("${test.app.secret}")
    private String secret;

    @Value("${test.app.lifetime}")
    private Long lifetime;

    private SecretKey key;

    // Инициализация секретного ключа из строки при создании компонента
    public JwtCore(@Value("${test.app.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Генерация токена сессии
     * @param authentication интерфейс с данными об аутентификации
     * @return Строка с токеном
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + lifetime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getNameFromJwt(String jwtToken) {
        return Arrays.toString(Jwts.parser()
                .verifyWith(key)
                .build()
                .parseUnsecuredContent(jwtToken)
                .getPayload());
    }
}
