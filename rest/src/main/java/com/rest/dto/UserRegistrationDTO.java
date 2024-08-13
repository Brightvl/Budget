package com.rest.dto;

import com.rest.model.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRegistrationDTO {
    private String login;
    private String email;
    private String password;
    private Role role;

    public UserRegistrationDTO() {}

    public UserRegistrationDTO(String login, String email, String password, Role role) {
        this.login = login;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
