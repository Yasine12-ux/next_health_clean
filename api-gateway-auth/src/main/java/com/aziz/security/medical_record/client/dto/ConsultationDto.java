package com.aziz.security.medical_record.client.dto;

import java.time.LocalDateTime;

public record ConsultationDto(

        Integer id,
        Integer idPatient,
        String patientFullName,
        int idAppointment,
        LocalDateTime date,
        String motif,
        int poidsKg,
        int tailleCm,
        int pouls,
        boolean complete,
        int tensionArterielle,
        String diagnostic
) {
}