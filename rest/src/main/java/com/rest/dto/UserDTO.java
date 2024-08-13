package com.rest.dto;

import com.rest.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String login;
    private String email;
    private Role role;
}
