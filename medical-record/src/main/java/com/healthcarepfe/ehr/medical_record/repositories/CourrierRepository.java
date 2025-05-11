package com.healthcarepfe.ehr.medical_record.repositories;

import com.healthcarepfe.ehr.medical_record.details.Courrier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourrierRepository extends JpaRepository<Courrier, Integer> {
}
