package com.aziz.security.structures.line;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LineRepository extends JpaRepository<Line,Integer> {
    public Optional<Line> findLineByNameAndSegmentId(String name, Integer segmentId);
    public List<Line> findLinesBySegmentId(Integer segmentId);

}
