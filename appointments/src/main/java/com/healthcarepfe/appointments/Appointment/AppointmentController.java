package com.healthcarepfe.appointments.Appointment;

import com.healthcarepfe.appointments.Appointment.Dto.ChangeAppointmentStatusDto;
import com.healthcarepfe.appointments.Appointment.Dto.CreateAppointmentDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    public final AppointmentService appointmentService;

    @PostMapping("/book")
    @Operation(summary = "✅ : create appointment")
    public ResponseEntity<?> bookAppointment(
            @RequestBody CreateAppointmentDto createAppointmentDto
    ){
        return appointmentService.createAppointment(createAppointmentDto);
    }
    @GetMapping("/by-patients")
    public ResponseEntity<?> getAllAppointmentsByPatients(
            @RequestParam ArrayList<Integer>  patientIds
    ){
        return appointmentService.getAllAppointmentsByPatients(patientIds);
    }
    @GetMapping("/by-patients-date/{startDate}/{endDate}")
    public ResponseEntity<?> getAllAppointmentsByPatients(
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate,
            @RequestParam List<Integer> patientIds    ){
        return appointmentService.getAllAppointmentsByPatientsAndDateInterval(startDate, endDate, patientIds);
    }

    /**
     * Get Appointment by plant (Cabinet medical)
     * @param startDate
     * @param endDate
     * @param plantId
     * @return
     */
    @GetMapping("/by-plants/{plantId}/{startDate}/{endDate}")
    public ResponseEntity<?> getAllAppointmentsByPlant(
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate,
            @PathVariable Integer plantId
    ){
        return appointmentService.getAllAppointmentsByPlant(startDate,endDate,plantId);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointmentsByPatients(){
        return appointmentService.getAllAppointments();
    }

    @PutMapping("/status")
    public ResponseEntity<?> changeAppointmentStatus(
            @RequestBody ChangeAppointmentStatusDto changeAppointmentStatusDto
    ){
        return appointmentService.changeAppointmentStatus(changeAppointmentStatusDto);
    }

    @GetMapping("/available-times/{date}/{plantId}")
    public ResponseEntity<?> getAvailableTimes(
            @PathVariable LocalDate date,
            @PathVariable Integer plantId
            ){
        return appointmentService.getAvailableTimes(date,plantId);
    }

    @GetMapping("/by-patients-year/{year}")
    public ResponseEntity<?> getThisYearRdvByMonthAndPatients(
            @PathVariable Integer year,
            @RequestParam List<Integer> patientIds ){
        return appointmentService.countByMonthAllAppointmentsByPatientsAndYear(patientIds,year);
    }
    @GetMapping("/by-plant-year/{year}/{plant}")
    public ResponseEntity<?> getThisYearRdvByMonthAndPlant(
            @PathVariable Integer year,
            @PathVariable Integer plant){
        return appointmentService.countByMonthAllAppointmentsByPlantAndYear(plant,year);
    }

    @GetMapping("/byId/{id}")
    public ResponseEntity<?> getAppointmentById(
            @PathVariable Integer id
    ){
        return appointmentService.getAppointmentById(id);
    }

}
