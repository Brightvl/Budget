package com.rest.controller;

import com.rest.dto.LoginRequestDTO;
import com.rest.dto.UserDTO;
import com.rest.dto.UserRegistrationDTO;
import com.rest.model.Role;
import com.rest.model.User;
import com.rest.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public UserController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegistrationDTO userDTO) {
        if (userService.getUserByLogin(userDTO.getLogin()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
        }

        User user = new User();
        user.setLogin(userDTO.getLogin());
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating user");
        }
    }



    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getLogin(), loginRequestDTO.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User authenticatedUser = userService.getUserByLogin(loginRequestDTO.getLogin());

        if (authenticatedUser.getRole() == Role.ADMIN) {
            UserDTO userDTO = new UserDTO(authenticatedUser.getId(), authenticatedUser.getLogin(), authenticatedUser.getEmail(), authenticatedUser.getRole());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    @GetMapping("/{login}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String login) {
        User user = userService.getUserByLogin(login);
        if (user != null) {
            UserDTO userDTO = new UserDTO(user.getId(), user.getLogin(), user.getEmail(), user.getRole());
            return ResponseEntity.ok(userDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        User user = userService.getUserById(id);
        user.setLogin(userDTO.getLogin());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());

        User updatedUser = userService.updateUser(id, user);

        UserDTO updatedUserDTO = new UserDTO(updatedUser.getId(), updatedUser.getLogin(), updatedUser.getEmail(), updatedUser.getRole());
        return ResponseEntity.ok(updatedUserDTO);
    }
}