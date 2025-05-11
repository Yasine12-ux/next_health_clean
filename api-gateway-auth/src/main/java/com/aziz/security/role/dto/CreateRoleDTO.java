package com.aziz.security.role.dto;

import java.util.List;

public record CreateRoleDTO(String name,String description, List<Integer> rolePermissionsIds) {
}
