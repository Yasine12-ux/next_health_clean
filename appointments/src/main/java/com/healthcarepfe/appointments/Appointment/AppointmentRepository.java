package com.healthcarepfe.appointments.Appointment;

import org.hibernate.annotations.processing.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {
    public List<Appointment> findAllByPatientId(Integer patientId);
    public List<Appointment> findAllByStartTimeBetweenAndPatientIdIn(LocalDateTime start, LocalDateTime end,List<Integer> patientIds);
    public List<Appointment> findAllByStartTimeBetweenAndAppointmentLocationPlantIdAndStatus(LocalDateTime start, LocalDateTime end,Integer plant,AppointmentStatus appointmentStatus);
    public List<Appointment> findAllByStartTimeBetweenAndAppointmentLocationPlantIdAndStatusNot(LocalDateTime start, LocalDateTime end,Integer plant,AppointmentStatus appointmentStatus);
    public List<Appointment> findAllByStartTimeBetweenAndAppointmentLocationPlantId(LocalDateTime start, LocalDateTime end,Integer plant);

    public List<Appointment> findByPatientIdAndStatus(Integer patientID, AppointmentStatus status);

    // get nb appointments by month Group by month
    @Query(value = "SELECT count(*) as count, EXTRACT(MONTH FROM start_time) as month FROM appointment WHERE patient_id IN (:patientIds) AND EXTRACT(YEAR FROM start_time) = :year GROUP BY month", nativeQuery = true)
    public List<Object[]> countByMonthAllAppointmentsByPatientsAndYear(@Param("patientIds") List<Integer> patientIds, @Param("year") Integer year);
    @Query(value = "SELECT count(*) as count, EXTRACT(MONTH FROM start_time) as month FROM appointment WHERE appointment.appointment_location_plant_id=:plant AND EXTRACT(YEAR FROM start_time) = :year GROUP BY month", nativeQuery = true)
    public List<Object[]> countByMonthAllAppointmentsByPlantAndYear(@Param("plant") Integer plant, @Param("year") Integer year);

}
