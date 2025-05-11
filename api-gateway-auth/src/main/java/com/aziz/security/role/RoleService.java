package com.aziz.security.role;

import com.aziz.security.auth.AuthenticationService;
import com.aziz.security.notification.NotificationService;
import com.aziz.security.permission.Permission;
import com.aziz.security.permission.PermissionRepository;
import com.aziz.security.permission.StructureRelationType;
import com.aziz.security.role.dto.CreateRoleDTO;
import com.aziz.security.role.dto.FullRoleDTO;
import com.aziz.security.role.dto.roleNameDTO;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final AuthenticationService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final NotificationService notificationService;
    public List<String> findAllRolesNames(){
        return roleRepository.findAll()
                .stream()
                .map(Role::getName)
                .toList();
    }
    public List<FullRoleDTO> findAllRoles(){
        return roleRepository.findAll()
                .stream()
                .map(this::convertToFullRoleDTO)
                .toList();
    }
    public FullRoleDTO getRolePermissions(String roleName){
        var role = roleRepository.findRoleByName(roleName)
                .orElseThrow();
        return convertToFullRoleDTO(role);
    }
    public roleNameDTO getRoleNamePermissions(String roleName){
        var role = roleRepository.findRoleByName(roleName)
                .orElseThrow();
        return new roleNameDTO(role.getName(),role.getPermissions().stream().map(Permission::getName).collect(Collectors.toList()));
    }


    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ResponseEntity<?> createRole(CreateRoleDTO createRoleDTO) {
        var roleStored = roleRepository.findRoleByName(createRoleDTO.name());
        if (roleStored.isEmpty()) {
            var role = Role.builder()
                    .name(createRoleDTO.name())
                    .description(createRoleDTO.description())
                    .permissions(getPermissions(createRoleDTO.rolePermissionsIds()))
                    .build();
            roleRepository.save(role);





            return new ResponseEntity<>(convertToFullRoleDTO(role), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Role with the same name already exists", HttpStatus.BAD_REQUEST);
        }
    }

    private FullRoleDTO convertToFullRoleDTO(Role role){


        // add the permissions in the role with true

        return FullRoleDTO.fullRoleDTO(role,userRepository.countUsersByRole(role));
    }
    private Set<Permission> getPermissions(List<Integer> rolePermissions){
        return rolePermissions
                .stream()
                .map(rolePermissionId -> permissionRepository.findById(rolePermissionId).orElseThrow())
                .collect(Collectors.toSet());
    }

    public boolean isRoleInUse(Role role){
        return userRepository.countUsersByRole(role)>0;
    }

    public ResponseEntity<?> modifyRole(FullRoleDTO fullRoleDTO) {
        Optional<Role> role = roleRepository.findById(fullRoleDTO.id());
        if(role.isEmpty()) {
            return new ResponseEntity<>(-1, HttpStatus.NOT_MODIFIED);
        }else{
            role.get().setName(fullRoleDTO.name());
            role.get().setPermissions(getPermissions(fullRoleDTO.rolePermissionsIds()));
            roleRepository.save(role.get());
            return new ResponseEntity<>(convertToFullRoleDTO(role.get()), HttpStatus.OK);
        }

    }

    public ResponseEntity<?> deleteRole(Integer roleId) {
        Optional<Role> role = roleRepository.findById(roleId);
        if(role.isEmpty()) {
            return new ResponseEntity<>(roleId, HttpStatus.NOT_MODIFIED);
        }else{;
            if(isRoleInUse(role.get())){
                return new ResponseEntity<>(roleId,HttpStatus.BAD_REQUEST);
            }
            roleRepository.delete(role.get());
            return new ResponseEntity<>(roleId, HttpStatus.OK);
        }

    }

    public ResponseEntity<?> duplicateRole(String name) {
        Optional<Role> role = roleRepository.findRoleByName(name);
        if(role.isEmpty()) {
            return new ResponseEntity<>(-1, HttpStatus.NOT_MODIFIED);
        }
        StringBuilder nameBuilder = new StringBuilder(name);
        nameBuilder.append(" copy");
        int i=0;
        while(roleRepository.findRoleByName(nameBuilder.toString()+i).isPresent()){
            i++;
            if(i>10)return new ResponseEntity<>(-1, HttpStatus.NOT_MODIFIED);
        }
        name = nameBuilder.toString()+i;

        role.get().getPermissions().forEach(System.out::println);

        return createRole(new CreateRoleDTO(name,role.get().getDescription(),getRolePermissions(role.get().getName()).rolePermissionsIds()));
    }

    public Set<StructureRelationType> getRoleRequiredStructures(Role role){
        var ps= role.getPermissions().stream().map(Permission::getRequiredStructure).collect(Collectors.toSet());
        ps.remove(null);
        return ps;
    }
}
