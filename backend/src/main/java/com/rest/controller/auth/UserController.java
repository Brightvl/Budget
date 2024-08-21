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
    private final JwtCore jwtCore;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtCore jwtCore) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtCore = jwtCore;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO userDTO) {
        if (userService.getUserByLogin(userDTO.getLogin()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }

        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setName(userDTO.getName());
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

        String token = jwtCore.generateToken(authentication);

        UserDTO userDTO = new UserDTO(
                authenticatedUser.getId(),
                authenticatedUser.getLogin(),
                authenticatedUser.getName(),
                authenticatedUser.getEmail(),
                authenticatedUser.getRole(),
                authenticatedUser.getGoals().stream().map(Goal::getId).collect(Collectors.toList())
        );

        return ResponseEntity.ok(new JwtResponse(token, userDTO));
    }

    @GetMapping("/{login}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String login) {
        User user = userService.getUserByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getLogin(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getGoals().stream().map(Goal::getId).collect(Collectors.toList())
        );
        return ResponseEntity.ok(userDTO);
    }
    @GetMapping("/current")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();

        User user = userService.getUserByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getLogin(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getGoals().stream().map(Goal::getId).collect(Collectors.toList())
        );
        return ResponseEntity.ok(userDTO);
    }
}
