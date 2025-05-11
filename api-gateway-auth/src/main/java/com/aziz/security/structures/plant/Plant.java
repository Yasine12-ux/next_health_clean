package com.aziz.security.structures.plant;

import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
@Data
@Builder
public class Plant{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;

    @NonNull
    @Column(nullable = false,unique = true)
    String name;

    @OneToMany(mappedBy = "plant",cascade = CascadeType.ALL)
    private List<ProductSection> productSections;

    @ManyToOne
    private User manager;

    @OneToMany(mappedBy = "plantDoctor")
    private List<User> doctors;

    @OneToMany(mappedBy = "plantNurse")
    private List<User> nurses;
}