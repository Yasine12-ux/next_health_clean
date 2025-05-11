package com.aziz.security.permission;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;


    public ResponseEntity<List<String>> getAllPermissionsNames() {
        return ResponseEntity.ok(permissionRepository.findAll().stream().map(Permission::getName).collect(Collectors.toList()));
    }
    public ResponseEntity<List<FullPermissionDTO>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll().stream()
                .map(permission -> new FullPermissionDTO(permission.getId(),permission.getName(),permission.getDescription()))
                .collect(Collectors.toList()));
    }

}
