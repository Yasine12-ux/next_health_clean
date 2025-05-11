package com.healthcarepfe.appointments.Appointment.BlockOut;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record CreateBlockOutDto(Integer plantId, LocalDate startDate,LocalDate endDate,String startTime,String endTime) {
    public static BlockOut toBlockOut(CreateBlockOutDto createBlockOutDto){
        return BlockOut.builder()
                .startDate(createBlockOutDto.startDate)
                .endDate(createBlockOutDto.endDate)
                .startTime(LocalTime.parse(createBlockOutDto.startTime))
                .endTime(LocalTime.parse(createBlockOutDto.endTime))
                .plantId(createBlockOutDto.plantId)
                .build();
    }
}
