package com.aziz.security.structures.line;

import com.aziz.security.structures.segment.Segment;
import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Data
public class Line{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;
    @Column(nullable = false)
    String name;
    @ManyToOne
    private Segment segment;


    @ManyToOne
    private User lineManager;

    @OneToMany(mappedBy = "lineWorking")
    private List<User> workers;

}
