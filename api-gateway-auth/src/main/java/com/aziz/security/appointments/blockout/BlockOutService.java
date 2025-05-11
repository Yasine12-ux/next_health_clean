package com.aziz.security.appointments.blockout;

import com.aziz.security.appointments.blockout.dto.BlockOutClientDto;
import com.aziz.security.appointments.blockout.dto.CreateBlockOutClientDto;
import com.aziz.security.appointments.dto.CreateBlockOutDto;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BlockOutService {
    private final BlockOutClient blockOutClient;
    private final UserRepository userRepository;
    private final AllPermissionService allPermissionService;

    public ResponseEntity<?> createBlockOut(CreateBlockOutDto createBlockOutDto, String email) {
        var userOptional = userRepository.findByEmail(email);
        ResponseEntity<Object> BAD_REQUEST = verifyPermission(userOptional);
        if (BAD_REQUEST != null) return BAD_REQUEST;
        var dto =new CreateBlockOutClientDto(userOptional.get().getPlantNurse().getId(), createBlockOutDto.startDate(), createBlockOutDto.endDate(), LocalTime.parse(createBlockOutDto.startTime()),LocalTime.parse(createBlockOutDto.endTime()));
        System.out.println(dto);
        return blockOutClient.create(dto);
    }

    public ResponseEntity<?> updateBlockOut(BlockOutClientDto blockOutDto, String email) {
        var userOptional = userRepository.findByEmail(email);
        ResponseEntity<Object> BAD_REQUEST = verifyPermission(userOptional);
        if (BAD_REQUEST != null) return BAD_REQUEST;

        return blockOutClient.update(blockOutDto);
    }

    public ResponseEntity<?> findAllByPlant(String email){
        var userOptional = userRepository.findByEmail(email);
        ResponseEntity<Object> BAD_REQUEST = verifyPermission(userOptional);
        if (BAD_REQUEST != null) return BAD_REQUEST;

        return blockOutClient.findAllByPlant(userOptional.get().getPlantNurse().getId());
    }
    public ResponseEntity<?> delete(Integer id, String email){
        var userOptional = userRepository.findByEmail(email);
        ResponseEntity<Object> BAD_REQUEST = verifyPermission(userOptional);
        if (BAD_REQUEST != null) return BAD_REQUEST;

        return blockOutClient.delete(id);

    }


    private ResponseEntity<Object> verifyPermission(Optional<User> userOptional) {
        if (userOptional.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user = userOptional.get();
        if (!allPermissionService.userHasAnyPermission(user, Set.of(allPermissionService.getRDV_BLOCK_OUT_PERMISSION())))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return null;
    }


}
