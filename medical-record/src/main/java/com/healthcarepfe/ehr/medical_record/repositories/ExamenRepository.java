package com.healthcarepfe.ehr.medical_record.repositories;

import com.healthcarepfe.ehr.medical_record.details.Examen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamenRepository extends JpaRepository<Examen, Integer> {
}
