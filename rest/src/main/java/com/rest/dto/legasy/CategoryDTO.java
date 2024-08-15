package com.rest.dto.legasy;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private String type;
    private Long userId;
}
