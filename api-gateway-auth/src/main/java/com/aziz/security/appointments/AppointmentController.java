package com.aziz.security.appointments;

import com.aziz.security.appointments.client.AppointmentStatus;
import com.aziz.security.appointments.dto.CreateAppointmentDto;
import com.aziz.security.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/appointments")

public class AppointmentController {
    private final AppointmentService appointmentService;
    private final JwtService jwtService;
    @GetMapping("/all-line/{lineId}/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsByLine(
            @PathVariable Integer lineId,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        return appointmentService.getAllAppointmentsByLine(startDate,endDate,lineId);
    }
    @GetMapping("/all-segment/{segmentId}/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsBySegment(
            @PathVariable Integer segmentId,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        return appointmentService.getAllAppointmentsBySegment(startDate,endDate,segmentId);
    }
    @GetMapping("/all-rh/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsByRhSegment(
            HttpServletRequest request,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByRhSegment(startDate,endDate,email);
    }
    @GetMapping("/all-line-manager/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsByLineManager(
            HttpServletRequest request,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByLineManager(startDate,endDate,email);
    }
    @GetMapping("/all-segment-manager/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsBySegmentManager(
            HttpServletRequest request,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsBySegmentManager(startDate,endDate,email);
    }

    @GetMapping("/all-nurse/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsByNurse(
            HttpServletRequest request,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByNurse(startDate,endDate,email);
    }

    @GetMapping("/all-doctor/{startDate}/{endDate}")
    public ResponseEntity<?> getAppointmentsByDoctor(
            HttpServletRequest request,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByDoctor(startDate,endDate,email);
    }
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(
            HttpServletRequest request,
            @RequestBody CreateAppointmentDto createAppointmentDto
            ){
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return this.appointmentService.bookAppointment(createAppointmentDto,email);
    }
    @PutMapping("/status/{id}/{status}")
    public ResponseEntity<?> changeAppointmentStatus(
            HttpServletRequest request,
            @PathVariable Integer id,@PathVariable AppointmentStatus status
    ){
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.changeAppointmentStatus(id,status,email);
    }
    @GetMapping("/available-times/{date}/{plantId}")
    public ResponseEntity<?> getAvailableTimes(
            HttpServletRequest request,
            @PathVariable LocalDate date,
            @PathVariable Integer plantId

    ){
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAvailableTimes(date,plantId,email);
    }
    @GetMapping("/nurse-plant")
    public ResponseEntity<?> getNursePlant(
            HttpServletRequest request

    ){
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getNursePlant(email);
    }

    @GetMapping("/year-nb-rdvs/{year}")
    public ResponseEntity<?> countByMonthAllAppointmentsByYear(
            HttpServletRequest request,
          @PathVariable  Integer year ){

        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.countByMonthAllAppointmentsByPatientsAndYear(year,email);
    }
    @GetMapping("/year-nb-rdvs-plant-mg/{year}")
    public ResponseEntity<?> countByMonthAllAppointmentsByYearPlantManager(
            HttpServletRequest request,
            @PathVariable Integer year ){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.countByMonthAllAppointmentsByPatientsAndYearForPlantManager(year,email);
    }

}
