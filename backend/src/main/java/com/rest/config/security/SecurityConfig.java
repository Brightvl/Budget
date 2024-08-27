package com.rest.config.security;

import com.rest.service.auth.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Конфигурация безопасности для приложения REST API.
 *
 * <p>Этот класс отвечает за настройку безопасности, включая конфигурацию CORS, CSRF,
 * авторизацию и аутентификацию пользователей.</p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final TokenFilter tokenFilter;

    /**
     * Определяет цепочку фильтров безопасности для приложения.
     *
     * <p>Метод настраивает HttpSecurity, отключая CSRF, настраивая CORS, и задает правила
     * авторизации для различных конечных точек API. Также добавляется фильтр токенов
     * перед стандартным фильтром аутентификации.</p>
     *
     * @param http Объект для настройки безопасности HTTP.
     * @return Сконфигурированная цепочка фильтров безопасности.
     * @throws Exception В случае ошибки конфигурации.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                        })
                )
        ;

        return http.build();
    }

    /**
     * Настраивает CORS для приложения.
     *
     * <p>Этот метод определяет источники конфигурации CORS,
     * разрешая запросы с указанных доменов, методов и заголовков.</p>
     *
     * @return Источник конфигурации CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("http://localhost:5173");
        configuration.addAllowedOriginPattern("http://localhost:3000");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Определяет кодировщик паролей.
     *
     * <p>Используется BCryptPasswordEncoder для кодирования паролей.</p>
     *
     * @return Экземпляр PasswordEncoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Определяет менеджер аутентификации.
     *
     * <p>Этот метод возвращает стандартный AuthenticationManager,
     * который используется для аутентификации пользователей.</p>
     *
     * @param authenticationConfiguration Конфигурация аутентификации.
     * @return Экземпляр AuthenticationManager.
     * @throws Exception В случае ошибки создания AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
