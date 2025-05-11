package com.aziz.security.structures.segment;


import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class Segment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;
    @Column(nullable = false)
    String name;
    @ManyToOne
    private ProductSection productSection;
    @OneToMany(mappedBy = "segment", cascade = CascadeType.ALL)
    private List<Line> lines;

    @ManyToOne
    private User segmentManager;

    @ManyToOne
    private User humanResources;

}
