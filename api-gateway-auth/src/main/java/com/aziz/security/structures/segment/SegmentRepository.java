package com.aziz.security.structures.segment;

import jdk.dynalink.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SegmentRepository extends JpaRepository<Segment,Integer> {
    public Optional<Segment> findSegmentByNameAndProductSectionId(String name, Integer productSectionId);

    List<Segment> findByProductSectionId(Integer productSectionId);
}
