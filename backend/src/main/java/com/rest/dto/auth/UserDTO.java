package com.rest.dto.auth;

import com.rest.model.auth.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String name;
    private String login;
    private String email;
    private Role role;
    private List<Long> goalIds;

    public UserDTO(Long id, String login, String name, String email, Role role, List<Long> goalIds) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.role = role;
        this.goalIds = goalIds;
    }
}
