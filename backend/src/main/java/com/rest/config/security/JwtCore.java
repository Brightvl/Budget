package com.rest.config.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtCore {

    private final SecretKey key;

    @Value("${test.app.lifetime}")
    private Long lifetime;

    /**
     * Инициализация секретного ключа из строки при создании компонента
     * @param secret Ключевое слово
     */
    public JwtCore(@Value("${test.app.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Генерация токена сессии
     *
     * @param authentication интерфейс с данными об аутентификации
     * @return Строка с токеном
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + lifetime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Извлечение имени пользователя из JWT
     *
     * @param jwtToken JWT токен
     * @return Имя пользователя (subject)
     */
    public String getNameFromJwt(String jwtToken) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody()
                .getSubject();
    }
}
