package com.rest.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestDTO {
    private String login;
    private String password;


    public LoginRequestDTO() {}

    public LoginRequestDTO(String login, String password) {
        this.login = login;
        this.password = password;
    }

}
