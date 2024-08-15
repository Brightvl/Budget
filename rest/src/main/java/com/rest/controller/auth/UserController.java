package com.rest.controller.auth;

import com.rest.config.security.JwtCore;
import com.rest.dto.auth.JwtResponse;
import com.rest.dto.auth.LoginRequestDTO;
import com.rest.dto.auth.UserDTO;
import com.rest.dto.auth.UserRegistrationDTO;
import com.rest.model.Goal;
import com.rest.model.auth.Role;
import com.rest.model.auth.User;
import com.rest.service.auth.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtCore jwtCore) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtCore = jwtCore;
    }

    private final JwtCore jwtCore;


    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO userDTO) {
        if (userService.getUserByLogin(userDTO.getLogin()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }

        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : Role.USER);

        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty");
        }

        user.setPassword(userDTO.getPassword());

        try {
            userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getLogin(), loginRequestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User authenticatedUser = userService.getUserByLogin(loginRequestDTO.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtCore.generateToken(authentication); // Генерация JWT токена

        UserDTO userDTO = new UserDTO(
                authenticatedUser.getId(),
                authenticatedUser.getLogin(),
                authenticatedUser.getUsername(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRole(),
                authenticatedUser.getGoals().stream().map(Goal::getId).collect(Collectors.toList()),
                token // Передаем токен в UserDTO
        );

        // Возвращаем JwtResponse, содержащий токен и данные пользователя
        JwtResponse jwtResponse = new JwtResponse(token, userDTO);

        return ResponseEntity.ok(jwtResponse);
    }


    @GetMapping("/{login}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String login) {
        User user = userService.getUserByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getLogin(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getGoals().stream().map(goal -> goal.getId()).collect(Collectors.toList())
        );
        return ResponseEntity.ok(userDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!userDTO.getLogin().equals(user.getLogin()) && userService.getUserByLogin(userDTO.getLogin()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        user.setLogin(userDTO.getLogin());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());

        User updatedUser = userService.updateUser(id, user);

        UserDTO updatedUserDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getLogin(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getGoals().stream().map(goal -> goal.getId()).collect(Collectors.toList())
        );
        return ResponseEntity.ok(updatedUserDTO);
    }
}
