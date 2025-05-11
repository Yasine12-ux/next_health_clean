package com.healthcarepfe.appointments;

import com.healthcarepfe.appointments.Appointment.Appointment;
import com.healthcarepfe.appointments.Appointment.AppointmentRepository;
import com.healthcarepfe.appointments.Appointment.AppointmentService;
import com.healthcarepfe.appointments.Appointment.AppointmentStatus;
import com.healthcarepfe.appointments.Appointment.BlockOut.BlockOutService;
import com.healthcarepfe.appointments.Appointment.Dto.CreateAppointmentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@EnableFeignClients
@SpringBootApplication
@RequiredArgsConstructor
@EnableDiscoveryClient
public class AppointmentsApplication implements CommandLineRunner {

    private final AppointmentService appointmentService;
    private final BlockOutService blockOutService;
    private final AppointmentRepository appointmentRepository;

    public static void main(String[] args) {
        SpringApplication.run(AppointmentsApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("Starting data initialization...");

        int patientIdStartInterval = 56;
        int patientIdEndInterval = 84;

        List<Appointment> appointmentList = new ArrayList<>();
        AppointmentStatus[] appointmentStatuses = {
                AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED,
                AppointmentStatus.COMPLETED, AppointmentStatus.COMPLETED, AppointmentStatus.COMPLETED,
                AppointmentStatus.COMPLETED
        };

        Set<Integer> uniquePatientIds = new HashSet<>();

        for (LocalDate date = LocalDate.of(2023, 1, 1); date.isBefore(LocalDate.now().plusWeeks(1)); date = date.plusDays(1)) {
            System.out.println("Processing date: " + date);

            for (int shiftStart : new int[]{8, 13}) { // Matin : 8h-12h, Après-midi : 13h-17h
                for (int i = 0; i < 16; i++) {
                    if (Math.random() < 0.5) continue;

                    AppointmentStatus status = date.isAfter(LocalDate.now()) 
                            ? AppointmentStatus.SCHEDULED 
                            : appointmentStatuses[new Random().nextInt(appointmentStatuses.length)];

                    int patientId = new Random().nextInt(patientIdEndInterval - patientIdStartInterval) + patientIdStartInterval;
                    
                    if (date.isAfter(LocalDate.now()) && !uniquePatientIds.add(patientId)) {
                        continue; // Évite les doublons pour les RDV futurs
                    }

                    LocalDateTime startTime = date.atTime(shiftStart, 0).plusMinutes(i * 15);
                    LocalDateTime endTime = startTime.plusMinutes(15);

                    Appointment appointment = Appointment.builder()
                            .patientId(patientId)
                            .createdBy(0)
                            .appointmentDescription("")
                            .startTime(startTime)
                            .endTime(endTime)
                            .status(status)
                            .appointmentLocationPlantId(new Random().nextInt(2) + 1)
                            .build();

                    appointmentList.add(appointment);
                }
            }
        }

        appointmentRepository.saveAll(appointmentList);
        System.out.println("Data initialization completed successfully.");
    }
}
