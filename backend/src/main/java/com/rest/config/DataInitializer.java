package com.rest.config;

import com.rest.model.auth.Role;
import com.rest.model.auth.User;
import com.rest.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByLogin("admin").isEmpty()) {
                User admin = User.builder()
                        .login("admin")
                        .name("admin")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created");
            }
        };
    }
}
