package com.aziz.security.appointments.dashbord;


import com.aziz.security.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class DashboardService {
    private final UserRepository userRepository;


    public <FullAppointmentDto> ResponseEntity<?> getAllAppointmentsByPatients(String email){
        var user = userRepository.findByEmail(email);
        List<Integer> patientIds = new ArrayList<>();
        if(user.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      user.get().getLineWorking().getWorkers().forEach(worker -> {

              patientIds.add(worker.getId());

      });
        return null;
    }

    {
    }

}
