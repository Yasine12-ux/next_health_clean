package com.aziz.security.appointments;


import com.aziz.security.appointments.client.AppointmentClient;
import com.aziz.security.appointments.client.AppointmentStatus;
import com.aziz.security.appointments.client.dto.ChangeAppointmentStatusClientDto;
import com.aziz.security.appointments.client.dto.FullAppointmentClientDto;
import com.aziz.security.appointments.dto.CreateAppointmentDto;
import com.aziz.security.appointments.dto.FullAppointmentDto;
import com.aziz.security.custom_annotations.method_annotations.LogMethodTimeAspect;
import com.aziz.security.notification.NotificationService;
import com.aziz.security.notification.sms.service.TwilioSmsService;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.line.LineRepository;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.plant.PlantRepository;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.product_section.ProductSectionRepository;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.structures.segment.SegmentRepository;
import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentClient appointmentClient;
    private final UserRepository userRepository;
    private final LineRepository lineRepository;
    private final SegmentRepository segmentRepository;
    private final ProductSectionRepository productSectionRepository;
    private final PlantRepository plantRepository;
    private final AllPermissionService allPermissionService;

    private final NotificationService notificationService;
    private final TwilioSmsService sms;

    private static final Logger logger = Logger.getLogger(LogMethodTimeAspect.class.getName());

    public ResponseEntity<?> getAllAppointmentsByLine(LocalDate startDate,LocalDate endDate, Integer lineId){
        var lineOptional = lineRepository.findById(lineId);
        Line line;


        System.out.println(lineId);

        if(lineOptional.isPresent())
            line=lineOptional.get();
        else return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var workers= line.getWorkers();
        var workersIds = workers.stream().map(User::getId).collect(Collectors.toList());

        if(workers.isEmpty())
            return new ResponseEntity<>(HttpStatus.OK);

        List<FullAppointmentClientDto> appointmentClientDtos = appointmentClient.getAllAppointmentsByPatientsAndDates(startDate.toString(),endDate.toString(),workersIds).getBody();
        if(appointmentClientDtos==null || appointmentClientDtos.isEmpty())
            return new ResponseEntity<>(HttpStatus.OK);

        List<Integer> plantIds=appointmentClientDtos.stream().map(FullAppointmentClientDto::appointmentLocationPlantId).distinct().sorted().collect(Collectors.toList());
        List<String> plants = plantRepository.findAllById(plantIds).stream().map(Plant::getName).collect(Collectors.toList());
        Map<Integer,String> plantsMap = new HashMap<>();

        for (int i = 0; i < plantIds.size(); i++) {
            plantsMap.put(plantIds.get(i),plants.get(i));
        }


        List<Integer> patientIds=appointmentClientDtos.stream().map(FullAppointmentClientDto::patientId).distinct().sorted().collect(Collectors.toList());
        List<User> patients = userRepository.findAllById(patientIds).stream().sorted().collect(Collectors.toList());
        Map<Integer,User> patientsMap = new HashMap<>();

        for (int i = 0; i < patientIds.size(); i++) {
            patientsMap.put(patientIds.get(i),patients.get(i));
        }

        // retrieve the names of the users who's create the appointments

        List<Integer> createdByUsersIds=appointmentClientDtos.stream().map(FullAppointmentClientDto::createdBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<User> createdByUsers = userRepository.findAllById(createdByUsersIds).stream().sorted().collect(Collectors.toList());

        Map<Integer,User> createdByMap = new HashMap<>();

        for (int i = 0; i < createdByUsersIds.size(); i++) {
            createdByMap.put(createdByUsersIds.get(i),createdByUsers.get(i));
        }

        // retrieve the names of the users who's canceled the appointments
        List<Integer> canceledByUsersIds=appointmentClientDtos.stream().map(FullAppointmentClientDto::canceledBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<User> canceledByUsers = userRepository.findAllById(canceledByUsersIds).stream().sorted().collect(Collectors.toList());

        Map<Integer,User> canceledByMap = new HashMap<>();

        for (int i = 0; i < canceledByUsersIds.size(); i++) {
            canceledByMap.put(canceledByUsersIds.get(i),canceledByUsers.get(i));
        }


        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        appointmentDtos.addAll(appointmentClientDtos.stream().map(appointment-> {
                        var p = patientsMap.get(appointment.patientId());
                        var cu = createdByMap.getOrDefault(appointment.createdBy(),null);
                        var canceledByu = canceledByMap.getOrDefault(appointment.canceledBy(),null);

                            return new FullAppointmentDto(appointment.id(),
                                    p.getLineWorking().getSegment().getId(),
                                    p.getLineWorking().getId(),
                                    p.getId(),
                                    p.getFirstname() + " " + p.getLastname(),
                                    appointment.creationDate(),
                                    appointment.appointmentDescription(),
                                    appointment.startTime(),
                                    appointment.endTime(),
                                    appointment.status(),
                                    cu.getFirstname()+" "+cu.getLastname(),
                                    (canceledByu!=null)?canceledByu.getFirstname()+" "+canceledByu.getLastname():null,
                                    appointment.appointmentLocationPlantId(),
                                    plantsMap.get(appointment.appointmentLocationPlantId()),
                                    p.getLineWorking().getSegment().getProductSection().getPlant().getName()

                                    );
                        })
                        .collect(Collectors.toList()));
        return new ResponseEntity<>(appointmentDtos,HttpStatus.OK);
    }
    public ResponseEntity<?> getAllAppointmentsByNurse(LocalDate startDate,LocalDate endDate,String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
//        if (!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_NURSE_PERMISSION())) || !allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_RH_PERMISSION())))
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if(allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_RH_PERMISSION())))
        {

            List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

            ResponseEntity<?> segmentAppointmentDtos;
            for (Segment segment : user.getResourceHumanSegment()) {
                segmentAppointmentDtos = getAllAppointmentsBySegment(startDate,endDate,segment.getId());
                if (segmentAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return segmentAppointmentDtos;
                try{
                    List<FullAppointmentDto> data = (List<FullAppointmentDto>) segmentAppointmentDtos.getBody();
                    if(!data.isEmpty())
                        appointmentDtos.addAll(data);
                }catch (Exception ignored){}
            }
            return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);

        }
       else if (allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_NURSE_PERMISSION()))) {
            if (user.getPlantNurse() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            var appointmentClientDtos = appointmentClient.getAllAppointmentsByPlant(startDate.toString(), endDate.toString(), user.getPlantNurse().getId()).getBody();
            if (appointmentClientDtos == null || appointmentClientDtos.isEmpty())
                return new ResponseEntity<>(HttpStatus.OK);


            List<Integer> patientIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::patientId).distinct().sorted().collect(Collectors.toList());
            List<User> patients = userRepository.findAllById(patientIds).stream().sorted().collect(Collectors.toList());
            Map<Integer, User> patientsMap = new HashMap<>();

            for (int i = 0; i < patientIds.size(); i++) {
                patientsMap.put(patientIds.get(i), patients.get(i));
            }

            // retrieve the names of the users who's create the appointments

            List<Integer> createdByUsersIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::createdBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
            List<User> createdByUsers = userRepository.findAllById(createdByUsersIds).stream().sorted().collect(Collectors.toList());

            Map<Integer, User> createdByMap = new HashMap<>();

            for (int i = 0; i < createdByUsersIds.size(); i++) {
                createdByMap.put(createdByUsersIds.get(i), createdByUsers.get(i));
            }

            // retrieve the names of the users who's canceled the appointments
            List<Integer> canceledByUsersIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::canceledBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
            List<User> canceledByUsers = userRepository.findAllById(canceledByUsersIds).stream().sorted().collect(Collectors.toList());

            Map<Integer, User> canceledByMap = new HashMap<>();

            for (int i = 0; i < canceledByUsersIds.size(); i++) {
                canceledByMap.put(canceledByUsersIds.get(i), canceledByUsers.get(i));
            }


            List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

            appointmentDtos.addAll(appointmentClientDtos.stream().map(appointment -> {
                        var p = patientsMap.get(appointment.patientId());
                        var cu = createdByMap.getOrDefault(appointment.createdBy(), null);
                        var canceledByu = canceledByMap.getOrDefault(appointment.canceledBy(), null);

                        return new FullAppointmentDto(appointment.id(),
                                p.getLineWorking().getSegment().getId(),
                                p.getLineWorking().getId(),
                                p.getId(),
                                p.getFirstname() + " " + p.getLastname(),
                                appointment.creationDate(),
                                appointment.appointmentDescription(),
                                appointment.startTime(),
                                appointment.endTime(),
                                appointment.status(),
                                cu.getFirstname() + " " + cu.getLastname(),
                                (canceledByu != null) ? canceledByu.getFirstname() + " " + canceledByu.getLastname() : null,
                                appointment.appointmentLocationPlantId(),
                                user.getPlantNurse().getName(),
                                p.getLineWorking().getSegment().getProductSection().getPlant().getName()

                        );
                    })
                    .collect(Collectors.toList()));
            return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
        }
      else
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    public ResponseEntity<?> getAllAppointmentsByDoctor(LocalDate startDate, LocalDate endDate, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if (!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_DOCTOR_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getPlantDoctor() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var appointmentClientDtos = appointmentClient.getAllAppointmentsByPlant(startDate.toString(), endDate.toString(), user.getPlantDoctor().getId()).getBody();
        if (appointmentClientDtos == null || appointmentClientDtos.isEmpty())
            return new ResponseEntity<>(HttpStatus.OK);


        List<Integer> patientIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::patientId).distinct().sorted().collect(Collectors.toList());
        List<User> patients = userRepository.findAllById(patientIds).stream().sorted().collect(Collectors.toList());
        Map<Integer, User> patientsMap = new HashMap<>();

        for (int i = 0; i < patientIds.size(); i++) {
            patientsMap.put(patientIds.get(i), patients.get(i));
        }

        // retrieve the names of the users who's create the appointments

        List<Integer> createdByUsersIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::createdBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<User> createdByUsers = userRepository.findAllById(createdByUsersIds).stream().sorted().collect(Collectors.toList());

        Map<Integer, User> createdByMap = new HashMap<>();

        for (int i = 0; i < createdByUsersIds.size(); i++) {
            createdByMap.put(createdByUsersIds.get(i), createdByUsers.get(i));
        }

        // retrieve the names of the users who's canceled the appointments
        List<Integer> canceledByUsersIds = appointmentClientDtos.stream().map(FullAppointmentClientDto::canceledBy).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<User> canceledByUsers = userRepository.findAllById(canceledByUsersIds).stream().sorted().collect(Collectors.toList());

        Map<Integer, User> canceledByMap = new HashMap<>();

        for (int i = 0; i < canceledByUsersIds.size(); i++) {
            canceledByMap.put(canceledByUsersIds.get(i), canceledByUsers.get(i));
        }


        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        appointmentDtos.addAll(appointmentClientDtos.stream().map(appointment -> {
                    var p = patientsMap.get(appointment.patientId());
                    var cu = createdByMap.getOrDefault(appointment.createdBy(), null);
                    var canceledByu = canceledByMap.getOrDefault(appointment.canceledBy(), null);

                    return new FullAppointmentDto(appointment.id(),
                            p.getLineWorking().getSegment().getId(),
                            p.getLineWorking().getId(),
                            p.getId(),
                            p.getFirstname() + " " + p.getLastname(),
                            appointment.creationDate(),
                            appointment.appointmentDescription(),
                            appointment.startTime(),
                            appointment.endTime(),
                            appointment.status(),
                            cu.getFirstname() + " " + cu.getLastname(),
                            (canceledByu != null) ? canceledByu.getFirstname() + " " + canceledByu.getLastname() : null,
                            appointment.appointmentLocationPlantId(),
                            user.getPlantDoctor().getName(),
                            p.getLineWorking().getSegment().getProductSection().getPlant().getName()

                    );
                })
                .collect(Collectors.toList()));
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);

    }

    public ResponseEntity<?> getAllAppointmentsBySegment(LocalDate startDate,LocalDate endDate,Integer segmentId){
        var segment = segmentRepository.findById(segmentId);
        if(segment.isEmpty())  return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> lineAppointmentDtos;
        for(Line line:segment.get().getLines()){
            lineAppointmentDtos=getAllAppointmentsByLine(startDate,endDate,line.getId());
            if(lineAppointmentDtos.getStatusCode()==HttpStatus.BAD_REQUEST) return lineAppointmentDtos;
            else if(lineAppointmentDtos.getStatusCode()==HttpStatus.OK && lineAppointmentDtos.hasBody() && lineAppointmentDtos.getBody() instanceof List ){
                appointmentDtos.addAll((List<FullAppointmentDto>)lineAppointmentDtos.getBody());
            }
        }
        return new ResponseEntity<>(appointmentDtos,HttpStatus.OK);
    }
    public ResponseEntity<?> getAllAppointmentsByProductSection(LocalDate startDate,LocalDate endDate,Integer psId){
        var ps = productSectionRepository.findProductSectionById(psId);
        if(ps.isEmpty())  return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> segmentAppointmentDtos;
        for(Segment segment:ps.get().getSegments()){
            segmentAppointmentDtos=getAllAppointmentsBySegment(startDate,endDate,segment.getId());
            if(segmentAppointmentDtos.getStatusCode()==HttpStatus.BAD_REQUEST) return segmentAppointmentDtos;
            else if(segmentAppointmentDtos.getStatusCode()==HttpStatus.OK && segmentAppointmentDtos.hasBody() && segmentAppointmentDtos.getBody() instanceof List ){
                appointmentDtos.addAll((List<FullAppointmentDto>)segmentAppointmentDtos.getBody());
            }
        }
        return new ResponseEntity<>(appointmentDtos,HttpStatus.OK);
    }


    /**
     * Need RDV_RH_PERMISSION Permission
     * @return
     */
    public ResponseEntity<?> getAllAppointmentsByRhSegment(LocalDate startDate,LocalDate endDate,String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_RH_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if (user.getResourceHumanSegment() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getResourceHumanSegment().isEmpty()) return new ResponseEntity<>(HttpStatus.OK);
        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> segmentAppointmentDtos;
        for (Segment segment : user.getResourceHumanSegment()) {
            segmentAppointmentDtos = getAllAppointmentsBySegment(startDate,endDate,segment.getId());
            if (segmentAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return segmentAppointmentDtos;
            try{
                List<FullAppointmentDto> data = (List<FullAppointmentDto>) segmentAppointmentDtos.getBody();
                if(!data.isEmpty())
                    appointmentDtos.addAll(data);
            }catch (Exception ignored){}
        }
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }

    public ResponseEntity<?> getAllAppointmentsByLineManager(LocalDate startDate, LocalDate endDate, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_LINE_MANAGER_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getLineManaging() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getLineManaging().isEmpty()) return new ResponseEntity<>(HttpStatus.OK);
        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> lineAppointmentDtos;
        for (Line line : user.getLineManaging()) {
            lineAppointmentDtos = getAllAppointmentsByLine(startDate,endDate,line.getId());
            if (lineAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return lineAppointmentDtos;
            try{
                List<FullAppointmentDto> data = (List<FullAppointmentDto>) lineAppointmentDtos.getBody();
                if(!data.isEmpty())
                    appointmentDtos.addAll(data);
            }catch (Exception ignored){}
        }
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }

//    public ResponseEntity<?> getAllAppointmentsByRHSegment(LocalDate startDate, LocalDate endDate, String email) {
//        var userOptional = userRepository.findByEmail(email);
//        if (userOptional.isEmpty())
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        User user = userOptional.get();
//        if(!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_RH_MANAGER_PERMISSION())))
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        if (user.getResourceHumanSegmentManaging() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//        if (user.getResourceHumanSegmentManaging().isEmpty()) return new ResponseEntity<>(HttpStatus.OK);
//        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();
//
//        ResponseEntity<?> segmentAppointmentDtos;
//        for (Segment segment : user.getResourceHumanSegmentManaging()) {
//            segmentAppointmentDtos = getAllAppointmentsBySegment(startDate,endDate,segment.getId());
//            if (segmentAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return segmentAppointmentDtos;
//            try{
//                List<FullAppointmentDto> data = (List<FullAppointmentDto>) segmentAppointmentDtos.getBody();
//                if(!data.isEmpty())
//                    appointmentDtos.addAll(data);
//            }catch (Exception ignored){}
//        }
//        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
//    }

    public ResponseEntity<?> getAllAppointmentsBySegmentManager(LocalDate startDate, LocalDate endDate, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getRDV_SEGMENT_MANAGER_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getSegmentManaging() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getSegmentManaging().isEmpty()) return new ResponseEntity<>(HttpStatus.OK);
        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();


        ResponseEntity<?> segmentAppointmentDtos;
        for (Segment segment : user.getSegmentManaging()) {
            segmentAppointmentDtos = getAllAppointmentsBySegment(startDate,endDate,segment.getId());
            if (segmentAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return segmentAppointmentDtos;
            try{
                List<FullAppointmentDto> data = (List<FullAppointmentDto>) segmentAppointmentDtos.getBody();
                if(!data.isEmpty())
                    appointmentDtos.addAll(data);
            }catch (Exception ignored){}
        }
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }
//getgetAllAppointmentsByproductsectionManager
    public ResponseEntity<?> getAllAppointmentsByProductSectionManager(LocalDate startDate, LocalDate endDate, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getPS_MANAGER_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getProductSectionManaging() == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (user.getProductSectionManaging().isEmpty()) return new ResponseEntity<>(HttpStatus.OK);
        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> productSectionAppointmentDtos;
        for (ProductSection segment : user.getProductSectionManaging()) {
            productSectionAppointmentDtos = getAllAppointmentsByProductSection(startDate,endDate,segment.getId());
            if (productSectionAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) return productSectionAppointmentDtos;
            try{
                List<FullAppointmentDto> data = (List<FullAppointmentDto>) productSectionAppointmentDtos.getBody();
                if(!data.isEmpty())
                    appointmentDtos.addAll(data);
            }catch (Exception ignored){}
        }
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }
    //getAllAppointementby plant
    public ResponseEntity<?> getAllAppointmentsByPlant(LocalDate startDate, LocalDate endDate, Integer plantId) {
        var plant = plantRepository.findPlantById(plantId);
        if (plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<FullAppointmentDto> appointmentDtos = new ArrayList<>();

        ResponseEntity<?> productSectionAppointmentDtos;
        for (ProductSection productSection : plant.get().getProductSections()) {
            productSectionAppointmentDtos = getAllAppointmentsByProductSection(startDate, endDate, productSection.getId());
            if (productSectionAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST)
                return productSectionAppointmentDtos;
            try {
                List<FullAppointmentDto> data = (List<FullAppointmentDto>) productSectionAppointmentDtos.getBody();
                if (!data.isEmpty())
                    appointmentDtos.addAll(data);
            } catch (Exception ignored) {
            }
        }
        return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
    }


//getgetAllAppointmentsByplantmanager
public ResponseEntity<?> getAllAppointmentsByPlantManager(LocalDate startDate, LocalDate endDate, String email) {
    System.out.println("Retrieving user by email: " + email);
    var userOptional = userRepository.findByEmail(email);
    if (userOptional.isEmpty()) {
        System.out.println("User not found with email: " + email);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    User user = userOptional.get();
    System.out.println("User found: " + user.getId());

    if (!allPermissionService.userHasAllPermission(user, Set.of(allPermissionService.getDASHBOARD_PLANT_MANAGER_PERMISSION()))) {
        System.out.println("User does not have PLANT_MANAGER_PERMISSION: " + email);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    if (user.getPlantManaging() == null) {
        System.out.println("User is not managing any plants: " + email);
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    if (user.getPlantManaging().isEmpty()) {
        System.out.println("User manages no plants: " + email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    List<FullAppointmentDto> appointmentDtos = new ArrayList<>();
    ResponseEntity<?> plantAppointmentDtos;

    for (Plant plant : user.getPlantManaging()) {
        System.out.println("Processing plant: " + plant.getId());
        plantAppointmentDtos = getAllAppointmentsByPlant(startDate, endDate, plant.getId());
        if (plantAppointmentDtos.getStatusCode() == HttpStatus.BAD_REQUEST) {
            System.out.println("Error retrieving appointments for plant: " + plant.getId());
            return plantAppointmentDtos;
        }
        try {
            List<FullAppointmentDto> data = (List<FullAppointmentDto>) plantAppointmentDtos.getBody();
            if (data != null && !data.isEmpty()) {
                appointmentDtos.addAll(data);
            }
        } catch (Exception e) {
            System.out.println("Error processing appointments for plant: " + plant.getId());
            e.printStackTrace();
        }
    }
    return new ResponseEntity<>(appointmentDtos, HttpStatus.OK);
}
    /**
     * Need RDV_RH_PERMISSION Permission
     */
    public ResponseEntity<?> bookAppointment(CreateAppointmentDto createAppointmentDto, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getRDV_RH_PERMISSION(),allPermissionService.getRDV_NURSE_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if(! plantRepository.existsPlantById(createAppointmentDto.appointmentLocationPlantId()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        FullAppointmentClientDto fullAppointmentClientDto;
        // check if patient is inside his controlling segments
        var patient =userRepository.findById(createAppointmentDto.patientId());
        try {
            var res =  appointmentClient.bookAppointment(CreateAppointmentDto.toCreateAppointmentClientDto(createAppointmentDto,user.getId()));

            if(res.getStatusCode()!=HttpStatus.CREATED) return res;
            fullAppointmentClientDto= (FullAppointmentClientDto)res.getBody();

        }catch (FeignException.FeignClientException e){
            return new ResponseEntity<>(e.getMessage().toString(),HttpStatus.BAD_REQUEST);
        }

        var patientOptional = userRepository.findById(fullAppointmentClientDto.patientId());
        if(patientOptional.isEmpty())  return new ResponseEntity<>(HttpStatus.BAD_REQUEST); ;
        User p = patientOptional.get();

        var creatorOptional = userRepository.findById(fullAppointmentClientDto.createdBy());
        String creator = creatorOptional.isPresent()?patientOptional.get().getFirstname()+" "+patientOptional.get().getLastname():null;

        String canceledUser=null;
        if(fullAppointmentClientDto.canceledBy()!=null){
            var canceledOptional =userRepository.findById(fullAppointmentClientDto.canceledBy());
            canceledUser = canceledOptional.map(value -> value.getFirstname() + " " + value.getLastname()).orElse(null);
        }

        var plant = plantRepository.findPlantById(fullAppointmentClientDto.appointmentLocationPlantId());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST); ;

        var fullAppointmentDto= new FullAppointmentDto(fullAppointmentClientDto.id(),
                p.getLineWorking().getSegment().getId(),
                p.getLineWorking().getId(),
                p.getId(),
                p.getFirstname() + " " + p.getLastname(),
                fullAppointmentClientDto.creationDate(),
                fullAppointmentClientDto.appointmentDescription(),
                fullAppointmentClientDto.startTime(),
                fullAppointmentClientDto.endTime(),
                fullAppointmentClientDto.status(),
                creator,
                canceledUser,
                fullAppointmentClientDto.appointmentLocationPlantId(),
                plant.get().getName(),
                p.getLineWorking().getSegment().getProductSection().getPlant().getName());



        try {
            sms.sendSms(patient.get().getPhone(),"Bonjour , : "+patient.get().getFirstname()+" "+patient.get().getLastname()  +" vous avez un rendez-vous médical dans : "+createAppointmentDto.startTime().toLocalDate().toString()+" "+createAppointmentDto.startTime().toLocalTime().toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
        notificationService.sendNotificationToUser(patient.get().getId(),"un rendez-vous est crée pour : "+patient.get().getFirstname()+" "+patient.get().getLastname() +" dans la line"+ " "+patient.get().getLineWorking().getName() +" temp de rendez-vous : "+createAppointmentDto.startTime().toLocalDate().toString()+" "+createAppointmentDto.startTime().toLocalTime().toString());

        return new ResponseEntity<>(fullAppointmentDto,HttpStatus.CREATED);
    }

    public ResponseEntity<?> changeAppointmentStatus(Integer id, AppointmentStatus status, String email) {
          var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getRDV_RH_PERMISSION(),allPermissionService.getRDV_NURSE_PERMISSION(),allPermissionService.getRDV_DOCTOR_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);


        var rdv = appointmentClient.changeAppointmentStatus(new ChangeAppointmentStatusClientDto(id,status,user.getId()));
        if(rdv.getStatusCode()==HttpStatus.BAD_REQUEST) return rdv;

        System.out.println(rdv);

        FullAppointmentClientDto appointment;
            appointment =(FullAppointmentClientDto)rdv.getBody();

        var patientOptional = userRepository.findById(appointment.patientId());
        if(patientOptional.isEmpty()) return rdv;
        User p = patientOptional.get();

        var creatorOptional = userRepository.findById(appointment.createdBy());
        String creator = creatorOptional.isPresent()?patientOptional.get().getFirstname()+" "+patientOptional.get().getLastname():null;

        String canceledUser=null;
        if(appointment.canceledBy()!=null){
            var canceledOptional =userRepository.findById(appointment.canceledBy());
            canceledUser = canceledOptional.map(value -> value.getFirstname() + " " + value.getLastname()).orElse(null);
        }
        var plant = plantRepository.findPlantById(appointment.appointmentLocationPlantId());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST); ;


        var fullAppointmentDto= new FullAppointmentDto(appointment.id(),
                p.getLineWorking().getSegment().getId(),
                p.getLineWorking().getId(),
                p.getId(),
                p.getFirstname() + " " + p.getLastname(),
                appointment.creationDate(),
                appointment.appointmentDescription(),
                appointment.startTime(),
                appointment.endTime(),
                appointment.status(),
                creator,
                canceledUser,
                appointment.appointmentLocationPlantId(),
                plant.get().getName(),
                p.getLineWorking().getSegment().getProductSection().getPlant().getName());



                if (status.toString().equals("CANCELLED")) {
                    notificationService.sendNotificationToUser(patientOptional.get().getId(), "un rendez-vous est annuler pour " + patientOptional.get().getFirstname() + " " + patientOptional.get().getLastname() + " dans la ligne" + " " + patientOptional.get().getLineWorking().getName());
                   try {


                    sms.sendSms(patientOptional.get().getPhone(), "Bonjour , : " + patientOptional.get().getFirstname() + " " + patientOptional.get().getLastname() + " votre rdv est annuler");

                } catch (Exception e) {
                e.printStackTrace();
            }

            }


        return new ResponseEntity<>(fullAppointmentDto,HttpStatus.OK);

    }

    public ResponseEntity<?> getAvailableTimes(LocalDate date,Integer plantId, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getRDV_RH_PERMISSION(),allPermissionService.getRDV_NURSE_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);


        return this.appointmentClient.getAvailableTimes(date.toString(),plantId);
    }

    public ResponseEntity<?> getNursePlant(String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(StructureMiniDto.toStructureMiniDto(userOptional.get().getPlantNurse()),HttpStatus.OK);
    }

    public ResponseEntity<?> countByMonthAllAppointmentsByPatientsAndYear(Integer year,String email){
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getRDV_NURSE_PERMISSION(),allPermissionService.getRDV_DOCTOR_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if(allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getRDV_DOCTOR_PERMISSION())))
            return appointmentClient.getThisYearRdvByMonthAndPlant(year,user.getPlantDoctor().getId());
        else
            return appointmentClient.getThisYearRdvByMonthAndPlant(year,user.getPlantNurse().getId());
    }
    public ResponseEntity<?> countByMonthAllAppointmentsByPatientsAndYearForPlantManager(Integer year ,String email){

        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getDASHBOARD_PLANT_MANAGER_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<Integer> patientsIds = new ArrayList<>();
        for (Plant plant : user.getPlantManaging()) {
            for (ProductSection productSection : plant.getProductSections()) {
                for (Segment segment : productSection.getSegments()) {
                    for (Line line : segment.getLines()) {
                        for (User worker : line.getWorkers()) {
                            patientsIds.add(worker.getId());
                        }
                    }
                }
            }
        }

        return appointmentClient.getThisYearRdvByMonthAndPatients(year,patientsIds);
    }

    public ResponseEntity<?> countByMonthAllAppointmentsByPatientsAndYearForPSManager(Integer year, String email) {
        var userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if(!allPermissionService.userHasAnyPermission(user,Set.of(allPermissionService.getPS_MANAGER_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        List<Integer> patientsIds = new ArrayList<>();
        for (ProductSection productSection : user.getProductSectionManaging()) {
            for (Segment segment : productSection.getSegments()) {
                for (Line line : segment.getLines()) {
                    for (User worker : line.getWorkers()) {
                        patientsIds.add(worker.getId());
                    }
                }
            }
        }

        return appointmentClient.getThisYearRdvByMonthAndPatients(year,patientsIds);
    }

}