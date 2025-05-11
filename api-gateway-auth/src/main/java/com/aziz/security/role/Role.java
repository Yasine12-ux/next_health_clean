package com.aziz.security.role;

import com.aziz.security.permission.Permission;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Builder
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(unique = true)
  private String name;

  private String description;

  @Getter
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
          name = "roles_permissions",
          joinColumns = @JoinColumn(
                  name = "role_id", referencedColumnName = "id"),
          inverseJoinColumns = @JoinColumn(
                  name = "permission_id", referencedColumnName = "id"))
  private Set<Permission> permissions;



  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
            .stream()
            .map(permission -> new SimpleGrantedAuthority(permission.getName()))
            .collect(Collectors.toList());
    return authorities;
  }
}
