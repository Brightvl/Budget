package com.rest.dto.auth;

import lombok.Getter;

@Getter
public class JwtResponse {
    private final String token;
    private final UserDTO user;

    public JwtResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
