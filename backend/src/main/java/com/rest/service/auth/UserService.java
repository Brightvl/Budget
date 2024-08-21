package com.rest.service.auth;

import com.rest.model.auth.User;
import com.rest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDetails.getUsername()); // Обновление имени пользователя
        user.setLogin(userDetails.getLogin()); // Обновление логина
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());

        return userRepository.save(user); // Сохранение изменений
    }


    public User resetUserPassword(Long id, String newPassword) {
        User user = getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Хеширование нового пароля
        user.setPassword(passwordEncoder.encode(newPassword));

        return userRepository.save(user);
    }


    public void deleteUser(Long id) {
        User user = getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
