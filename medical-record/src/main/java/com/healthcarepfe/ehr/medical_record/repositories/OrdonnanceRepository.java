package com.healthcarepfe.ehr.medical_record.repositories;

import com.healthcarepfe.ehr.medical_record.details.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Integer> {
}
