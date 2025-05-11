package com.healthcarepfe.ehr.client;

import com.healthcarepfe.ehr.client.dto.ChangeAppointmentStatusClientDto;
import com.healthcarepfe.ehr.client.dto.CreateAppointmentClientDto;
import com.healthcarepfe.ehr.client.dto.FullAppointmentClientDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@FeignClient(name = "appointments-service",url = "${application.config.appointments-url}/appointments")
public interface AppointmentClient {
    @PutMapping("/status")
    ResponseEntity<FullAppointmentClientDto> changeAppointmentStatus(
            @RequestBody ChangeAppointmentStatusClientDto changeAppointmentStatusDto
    );
    @GetMapping("/byId/{id}")
    ResponseEntity<?> getAppointmentById(
            @PathVariable Integer id
    );
}