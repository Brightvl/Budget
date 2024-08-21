package com.rest.dto.auth;

import com.rest.model.auth.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRegistrationDTO {
    private String login;
    private String name;
    private String email;
    private String password;
    private Role role;

    public UserRegistrationDTO() {}

    public UserRegistrationDTO(String login, String name, String email, String password, Role role) {
        this.login = login;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
