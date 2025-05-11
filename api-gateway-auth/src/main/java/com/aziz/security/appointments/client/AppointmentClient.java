package com.aziz.security.appointments.client;

import com.aziz.security.appointments.client.dto.ChangeAppointmentStatusClientDto;
import com.aziz.security.appointments.client.dto.CreateAppointmentClientDto;
import com.aziz.security.appointments.client.dto.FullAppointmentClientDto;
import com.aziz.security.appointments.dto.FullAppointmentDto;
import jakarta.ws.rs.PUT;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
@FeignClient(name = "appointments-service",url = "${application.config.appointments-url}/appointments")
public interface AppointmentClient {
    @GetMapping("/by-patients")
    ResponseEntity<List<FullAppointmentClientDto>> getAllAppointmentsByPatients(@RequestParam List<Integer> patientIds);
    @PostMapping("/book")
    ResponseEntity<FullAppointmentClientDto> bookAppointment(@RequestBody CreateAppointmentClientDto createAppointmentDto);
    @PutMapping("/status")
    ResponseEntity<FullAppointmentClientDto> changeAppointmentStatus(
            @RequestBody ChangeAppointmentStatusClientDto changeAppointmentStatusDto
    );

    @GetMapping("/available-times/{date}/{plantId}")
    ResponseEntity<?> getAvailableTimes(
            @PathVariable String date,
            @PathVariable Integer plantId
    );

    @GetMapping("/by-patients-date/{startDate}/{endDate}")
    ResponseEntity<List<FullAppointmentClientDto>> getAllAppointmentsByPatientsAndDates(
            @PathVariable String  startDate,
            @PathVariable String  endDate,
            @RequestParam List<Integer> patientIds
    );
    @GetMapping("/by-plants/{plantId}/{startDate}/{endDate}")
    ResponseEntity<List<FullAppointmentClientDto>> getAllAppointmentsByPlant(
            @PathVariable String startDate,
            @PathVariable String endDate,
            @PathVariable Integer plantId
    );
    @GetMapping("/by-patients-year/{year}")
    public ResponseEntity<?> getThisYearRdvByMonthAndPatients(
            @PathVariable Integer year,
            @RequestParam List<Integer> patientIds );
    @GetMapping("/by-plant-year/{year}/{plant}")
    public ResponseEntity<?> getThisYearRdvByMonthAndPlant(
            @PathVariable Integer year,
            @PathVariable Integer plant);
}
