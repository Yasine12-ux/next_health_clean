package com.aziz.security.appointments.dashbord;


import com.aziz.security.appointments.AppointmentService;
import com.aziz.security.config.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;

@AllArgsConstructor
@Controller
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final JwtService jwtService;
    private final AppointmentService appointmentService;
    @Operation(summary = "Get all appointments by patients line")
    @GetMapping("/all-line")
    public ResponseEntity<?> getAllAppointmentsByPatientsLine(HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        System.out.println(email);
        return appointmentService.getAllAppointmentsByLineManager(LocalDate.of(1900,10,10),LocalDate.of(4000,10,10),email);
    }
    @Operation(summary = "Get all appointments by patients segment")
    @GetMapping("/all-segment")
    public ResponseEntity<?> getAllAppointmentsByPatientsSegment(HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsBySegmentManager(LocalDate.of(1900,10,10),LocalDate.of(4000,10,10),email);
    }
    @Operation(summary = "Get all appointments by patients PS")
    @GetMapping("/all-ps")
    public ResponseEntity<?> getAllAppointmentsByPatientsPS(HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByProductSectionManager(LocalDate.of(1900,10,10),LocalDate.of(4000,10,10),email);
    }

    @Operation(summary = "Get all appointments by patients plant")
    @GetMapping("/all-plant")
    public ResponseEntity<?> getAllAppointmentsByPatientsPlant(HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found", HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return appointmentService.getAllAppointmentsByPlantManager(LocalDate.of(1900,10,10),LocalDate.of(4000,10,10),email);
    }

}
