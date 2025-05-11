package com.aziz.security.permission;

import java.util.Set;

public record PermissionStructureRequiredDto(String name, Set<String> permissions) {
}
