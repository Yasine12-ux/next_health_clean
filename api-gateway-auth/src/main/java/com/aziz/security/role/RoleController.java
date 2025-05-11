package com.aziz.security.role;

import com.aziz.security.permission.FullPermissionDTO;
import com.aziz.security.permission.Permission;
import com.aziz.security.permission.PermissionService;
import com.aziz.security.role.dto.CreateRoleDTO;
import com.aziz.security.role.dto.FullRoleDTO;
import com.aziz.security.role.dto.roleNameDTO;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;
    private final PermissionService permissionService;
    @Operation(summary = "✅ : get all roles names")
    @GetMapping("names")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    public List<String> findAllRolesNames(){
        return roleService.findAllRolesNames();
    }

    @Operation(summary = "✅ : get all roles")
    @GetMapping("all")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    public List<FullRoleDTO> findAllRoles(){
        return roleService.findAllRoles();
    }
    @Operation(summary = "✅ : get role Id permissions")
    @GetMapping("/role/{name}")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    public FullRoleDTO getRolePermissions(
            @PathVariable String name
            ){
        return roleService.getRolePermissions(name);
    }

    @Operation(summary = "✅ : get role Name permissions")
    @GetMapping("/roleName/{name}")
    public roleNameDTO getRoleNamePermissions(
            @PathVariable String name
    ){
        return roleService.getRoleNamePermissions(name);
    }
    @Operation(summary = "✅ : get permissions(our functionality)")
    @GetMapping("/permissions-names")
    public ResponseEntity<List<String>> getAllPermissionsNames(){
        return permissionService.getAllPermissionsNames();
    }

    @Operation(summary = "✅ : cree role")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    @PostMapping("/role")
    public ResponseEntity<?> createRole(
            @RequestBody CreateRoleDTO createRoleDTO){
        return roleService.createRole(createRoleDTO);
    }

    @Operation(summary = "✅ : duplicate role")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    @PostMapping("/role/{name}")
    public ResponseEntity<?> duplicateRole(
            @PathVariable String name){
        return roleService.duplicateRole(name);
    }

    @Operation(summary = "✅:Modify role info")
    @PutMapping("/role")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    public ResponseEntity<?> modifyRole(
            @RequestBody FullRoleDTO fullRoleDTO
    ){
        return roleService.modifyRole(fullRoleDTO);
    }

    @Operation(summary = "✅:Delete role by name")
    @DeleteMapping("/role/{id}")
    @PreAuthorize("hasAuthority('ROLE_MANAGEMENT')")
    public ResponseEntity<?> deleteRole(
        @PathVariable Integer id
    ){
        return roleService.deleteRole(id);
    }
    @Operation(summary = "✅ : get all permissions")
    @GetMapping("permissions")
    public ResponseEntity<List<FullPermissionDTO>> findAllPermissions(){
        return permissionService.getAllPermissions();
    }




}
