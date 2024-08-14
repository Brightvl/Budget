package com.rest.dto.user;

import com.rest.model.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserRegistrationDTO {
    private String login;
    private String username;
    private String email;
    private String password;
    private Role role;

    public UserRegistrationDTO() {}

    public UserRegistrationDTO(String login, String username, String email, String password, Role role) {
        this.login = login;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
