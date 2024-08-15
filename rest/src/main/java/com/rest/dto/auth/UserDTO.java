package com.rest.dto.auth;

import com.rest.model.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String login;
    private String email;
    private Role role;
    private List<Long> goalIds;
    private String token;

    public UserDTO(Long id, String login, String username, String email, Role role, List<Long> goalIds) {
        this.id = id;
        this.login = login;
        this.username = username;
        this.email = email;
        this.role = role;
        this.goalIds = goalIds;
    }
    public UserDTO(Long id, String login, String username, String email, Role role, List<Long> goalIds, String token) {
        this.id = id;
        this.login = login;
        this.username = username;
        this.email = email;
        this.role = role;
        this.goalIds = goalIds;
        this.token = token;
    }
}
