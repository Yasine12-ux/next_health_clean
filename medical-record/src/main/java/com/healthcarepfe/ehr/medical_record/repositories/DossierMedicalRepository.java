package com.healthcarepfe.ehr.medical_record.repositories;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DossierMedicalRepository extends JpaRepository<MedicalRecord, Integer> {

    //get by cin
    Optional<MedicalRecord> findByFicheAdministrativeCin(String cin);
}
