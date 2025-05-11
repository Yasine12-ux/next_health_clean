package com.healthcarepfe.ehr.medical_record.repositories;

import com.healthcarepfe.ehr.medical_record.details.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {

    Optional<Consultation> findByIdAppointment(int idAppointment);
}
