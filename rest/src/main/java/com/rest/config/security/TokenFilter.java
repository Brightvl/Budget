package com.rest.config.security;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Фильтр для работы с токенами
 */
@Component
public class TokenFilter extends OncePerRequestFilter {

    private final JwtCore jwtCore;
    private final UserDetailsService userDetailsService;

    public TokenFilter(JwtCore jwtCore, UserDetailsService userDetailsService) {
        this.jwtCore = jwtCore;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwtToken = null;
        String username = null;
        UserDetails userDetails = null;

        try {
            String headerAuth = request.getHeader("Authorization");
            if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
                jwtToken = headerAuth.substring(7);
            }

            if (jwtToken != null) {
                try {
                    username = jwtCore.getNameFromJwt(jwtToken);
                } catch (ExpiredJwtException e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                    return;
                }
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred during token processing");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
