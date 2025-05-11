package com.aziz.security.permission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission,Integer> {
    public Optional<Permission> findByName(String name);
}
