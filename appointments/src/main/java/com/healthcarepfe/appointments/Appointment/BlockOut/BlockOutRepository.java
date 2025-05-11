package com.healthcarepfe.appointments.Appointment.BlockOut;

import com.healthcarepfe.appointments.Appointment.Appointment;
import com.healthcarepfe.appointments.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BlockOutRepository extends JpaRepository<BlockOut,Integer> {
    List<BlockOut> findAllByStartDateLessThanEqualAndEndDateGreaterThanEqualAndPlantId(LocalDate startDate, LocalDate endDate, Integer plant);

    public List<BlockOut> findAllByPlantId(Integer plantId);
}
