package com.healthcarepfe.appointments.Appointment;

import com.healthcarepfe.appointments.Appointment.BlockOut.BlockOut;
import com.healthcarepfe.appointments.Appointment.BlockOut.BlockOutRepository;
import com.healthcarepfe.appointments.Appointment.Dto.ChangeAppointmentStatusDto;
import com.healthcarepfe.appointments.Appointment.Dto.CreateAppointmentDto;
import com.healthcarepfe.appointments.Appointment.Dto.FullAppointmentDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    public final BlockOutRepository blockOutRepository;

    public ResponseEntity<?> getAllAppointmentsByPatients(List<Integer> patientsIds ){
        List<Appointment> fullAppointmentDtos=new ArrayList<>();

        for (Integer patientsId : patientsIds) {
            var x =appointmentRepository.findAllByPatientId(patientsId);
            fullAppointmentDtos.addAll(x);
        }
        return new ResponseEntity<>(fullAppointmentDtos,HttpStatus.OK);
    }
    public ResponseEntity<?> getAllAppointmentsByPatientsAndDateInterval(LocalDate start,LocalDate end,List<Integer> patientsIds ){


        List<Appointment> rdvs =appointmentRepository.findAllByStartTimeBetweenAndPatientIdIn(start.atStartOfDay(),end.atStartOfDay(),patientsIds);

        return new ResponseEntity<>(rdvs,HttpStatus.OK);
    }
    public ResponseEntity<?> countByMonthAllAppointmentsByPatientsAndYear(List<Integer> patientsIds,Integer year ){

        List<Object[]> rdvsCount = appointmentRepository.countByMonthAllAppointmentsByPatientsAndYear(patientsIds,year);
        return  new ResponseEntity<>(rdvsCount,HttpStatus.OK);
    }
    public ResponseEntity<?> countByMonthAllAppointmentsByPlantAndYear(Integer plantId,Integer year ){
        List<Object[]> rdvsCount = appointmentRepository.countByMonthAllAppointmentsByPlantAndYear(plantId,year);
        return  new ResponseEntity<>(rdvsCount,HttpStatus.OK);
    }



    public ResponseEntity<?> createAppointment(CreateAppointmentDto createAppointmentDto){
        try{
            if(createAppointmentDto.startTime().isAfter(createAppointmentDto.endTime()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            var rdv =appointmentRepository.findByPatientIdAndStatus(createAppointmentDto.patientId(),AppointmentStatus.SCHEDULED);
            if(!rdv.isEmpty())
                return new ResponseEntity<>(rdv.get(rdv.size()-1),HttpStatus.BAD_REQUEST);

            Appointment appointment= Appointment.builder()
                .patientId(createAppointmentDto.patientId())
                .appointmentDescription(createAppointmentDto.appointmentDescription())
                .startTime(createAppointmentDto.startTime()).creationDate(LocalDateTime.now())
                .endTime(createAppointmentDto.endTime())
                .status(createAppointmentDto.status())
                .createdBy(createAppointmentDto.createdBy())
                    .appointmentLocationPlantId(createAppointmentDto.appointmentLocationPlantId())
             .build();
             Appointment appointment1 = appointmentRepository.save(appointment);

             return new ResponseEntity<>(FullAppointmentDto.toFullAppointmentDto(appointment1),HttpStatus.CREATED);
         }catch (Exception e){
            System.out.println(e.getMessage());
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }
    }
    public ResponseEntity<?> getAllAppointments() {
        return new ResponseEntity<>(appointmentRepository.findAll(),HttpStatus.OK);
    }

    public ResponseEntity<?> changeAppointmentStatus(ChangeAppointmentStatusDto changeAppointmentStatusDto) {
        var rdv = appointmentRepository.findById(changeAppointmentStatusDto.id());
        if(rdv.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Appointment appointment=rdv.get();
        
        appointment.setStatus(changeAppointmentStatusDto.status());
        if(changeAppointmentStatusDto.status()==AppointmentStatus.CANCELLED) {
            appointment.setCanceledBy(changeAppointmentStatusDto.idDoneBy());
        }
        Appointment appointment1=appointmentRepository.save(appointment);
        return new ResponseEntity<>(appointment1,HttpStatus.OK);
    }

    public ResponseEntity<?> getAvailableTimes(LocalDate date,Integer plantId ) {
        Set<String> allTimes=new HashSet<>();
        LocalTime startDayTime = LocalTime.of(7,0);
        LocalTime endDayTime = LocalTime.of(17,0);

        List<BlockOut>blockOuts= blockOutRepository.findAllByStartDateLessThanEqualAndEndDateGreaterThanEqualAndPlantId(date,date,plantId);

;

        Boolean addItOrNo;

        for(LocalTime localTime=startDayTime;localTime.isBefore(endDayTime);localTime=localTime.plusMinutes(15)){
            addItOrNo=true;
            for(BlockOut blockOut:blockOuts){
                if(isIntersection(localTime,localTime.plusMinutes(15),blockOut.getStartTime().plusSeconds(1),blockOut.getEndTime().minusSeconds(1))) {
                    addItOrNo = false;
                    break;
                }
            }
            if(addItOrNo)
                allTimes.add(localTime.toString());
        }

        List<Appointment> existRdvs =appointmentRepository.findAllByStartTimeBetweenAndAppointmentLocationPlantIdAndStatusNot(date.atStartOfDay(),date.atStartOfDay().plusDays(1),plantId,AppointmentStatus.CANCELLED);

        Set<String> filledTime = existRdvs.stream().map(appointment ->appointment.getStartTime().toLocalTime().toString()).collect(Collectors.toSet());



        allTimes.removeAll(filledTime);

        ;
        return new ResponseEntity<>(allTimes.stream().sorted().collect(Collectors.toList()),HttpStatus.OK);
    }

    public ResponseEntity<?> getAllAppointmentsByPlant(LocalDate startDate, LocalDate endDate, Integer plantId) {
        List<Appointment> rdvs = appointmentRepository.findAllByStartTimeBetweenAndAppointmentLocationPlantId(startDate.atStartOfDay(),endDate.atStartOfDay(),plantId);
        return new ResponseEntity<>(rdvs,HttpStatus.OK);
    }
    private boolean isIntersection(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        // Check if one date range is completely before or after the other
        if (start1.isAfter(end2) || start2.isAfter(end1)) {
            return false;
        }
        // If not, there is intersection
        return true;
    }

    public ResponseEntity<?> getAppointmentById(Integer id) {
        var rdv = appointmentRepository.findById(id);
        if(rdv.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(FullAppointmentDto.toFullAppointmentDto(rdv.get()),HttpStatus.OK);
    }

}
