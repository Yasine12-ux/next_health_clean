package com.aziz.security.structures.product_section;

import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class ProductSection {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;
    String name;

    @ManyToOne
    private Plant plant;


    @OneToMany(mappedBy = "productSection",cascade = CascadeType.ALL)
    private List<Segment> segments;


    @ManyToOne
    private User manager;

    public ProductSection(String name, Plant plant){
        this.plant=plant;
        setName(name);
    }

}
