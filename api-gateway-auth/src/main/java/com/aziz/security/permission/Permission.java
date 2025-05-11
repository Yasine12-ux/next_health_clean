package com.aziz.security.permission;

import com.aziz.security.role.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Entity
@Getter
@Setter
public class Permission {

    public Permission(String name,String description){
        this.name=name;
        this.description=description;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(unique = true,nullable = false)
    private String name;

    private String description;
    @ManyToMany(mappedBy = "permissions")
    private List<Role> roles;

    @Enumerated(EnumType.STRING)
    private StructureRelationType requiredStructure;

    @Override
    public boolean equals(Object obj) {
        return Objects.equals(((Permission) obj).getId(), getId());
    }

    @Override
    public String toString() {
        return "Permission{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
