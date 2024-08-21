package com.rest.controller.auth;

import com.rest.dto.auth.UserDTO;
import com.rest.model.Goal;
import com.rest.model.auth.User;
import com.rest.service.auth.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getLogin(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getGoals().stream().map(goal -> goal.getId()).collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userService.getUserById(id);
        return userOpt.map(user -> ResponseEntity.ok(new UserDTO(
                        user.getId(),
                        user.getLogin(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getGoals().stream().map(goal -> goal.getId()).collect(Collectors.toList())
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/users/login/{login}")
    public ResponseEntity<Void> deleteUserByLogin(@PathVariable String login) {
        Optional<User> userOpt = userService.getUserByLogin(login);
        if (userOpt.isPresent()) {
            userService.deleteUser(userOpt.get().getId());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/users/login/{login}")
    public ResponseEntity<UserDTO> getUserByLogin(@PathVariable String login) {
        Optional<User> userOpt = userService.getUserByLogin(login);
        return userOpt.map(user -> ResponseEntity.ok(new UserDTO(
                        user.getId(),
                        user.getLogin(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getGoals().stream().map(goal -> goal.getId()).collect(Collectors.toList())
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверка на уникальность логина
        if (!userDTO.getLogin().equals(user.getLogin())) {
            if (userService.getUserByLogin(userDTO.getLogin()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            } else {
                user.setLogin(userDTO.getLogin());
            }
        }

        user.setName(userDTO.getName()); // Обновление имени пользователя
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());

        User updatedUser = userService.updateUser(id, user);

        UserDTO updatedUserDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getLogin(),
                updatedUser.getName(), // Передача обновленного имени
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getGoals().stream().map(Goal::getId).collect(Collectors.toList())
        );

        return ResponseEntity.ok(updatedUserDTO);
    }


    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<Void> resetUserPassword(@PathVariable Long id, @RequestBody Map<String, String> passwordRequest) {
        String newPassword = passwordRequest.get("password");
        userService.resetUserPassword(id, newPassword);
        return ResponseEntity.ok().build();
    }
}
