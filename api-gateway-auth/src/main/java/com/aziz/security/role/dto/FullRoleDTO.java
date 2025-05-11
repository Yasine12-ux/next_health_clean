package com.aziz.security.role.dto;

import com.aziz.security.permission.Permission;
import com.aziz.security.permission.PermissionStructureRequiredDto;
import com.aziz.security.permission.StructureRelationType;
import com.aziz.security.role.Role;
import lombok.Builder;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

public record FullRoleDTO(Integer id, String name, String description, List<Integer> rolePermissionsIds, Integer nbUsers, List<PermissionStructureRequiredDto> requiredStructures) {
    public static FullRoleDTO fullRoleDTO(Role role,Integer nbUsers){
        Map<StructureRelationType,List<Permission>> permissionMap= role.getPermissions().stream().filter(permission -> permission.getRequiredStructure()!=null).collect(groupingBy(Permission::getRequiredStructure));
        List<PermissionStructureRequiredDto> pSRDto = permissionMap.keySet().stream().map(pr->new PermissionStructureRequiredDto(pr.name(),permissionMap.get(pr).stream().map(Permission::getName).collect(Collectors.toSet()))).collect(Collectors.toList());

        return new FullRoleDTO(role.getId(), role.getName(),role.getDescription(),role.getPermissions().stream().map(Permission::getId).collect(Collectors.toList()),nbUsers,pSRDto);
    }

}
