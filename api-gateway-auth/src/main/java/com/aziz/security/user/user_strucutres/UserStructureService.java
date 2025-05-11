package com.aziz.security.user.user_strucutres;

import com.aziz.security.structures.line.LineRepository;
import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import com.aziz.security.user.user_strucutres.dto.UserStructureDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserStructureService {
    private final UserRepository repository;
    private final LineRepository lineRepository;

    public ResponseEntity<List<UserStructureDto>> findAllLineWorkers(Integer id){
        var lines = lineRepository.findById(id);
        if(lines.isEmpty()) return  new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(lines.get().getWorkers().stream().map(UserStructureDto::convertToUserStructureDto).collect(Collectors.toList()), HttpStatus.OK);

    }
    public ResponseEntity<?> findManySegmentManager(List<Integer> ids){
        List<User> segmentManagersList= repository.findAllById(ids);
        if(segmentManagersList.isEmpty())  return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        List<UserStructureDto> userStructureDtos = segmentManagersList.stream().map(UserStructureDto::convertToUserStructureDto).collect(Collectors.toList());
        return new ResponseEntity<>(userStructureDtos, HttpStatus.OK);
    }

    public ResponseEntity<?> findSegmentManager(Integer id){
        var user= repository.findUserBySegmentManagingId(id);
        if(user.isEmpty())return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(UserStructureDto.convertToUserStructureDto(user.get()), HttpStatus.OK);
    }

    public ResponseEntity<?> findProductSectionManager(Integer id){
        var user= repository.findUserByProductSectionManagingId(id);
        if(user.isEmpty())return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(UserStructureDto.convertToUserStructureDto(user.get()), HttpStatus.OK);
    }

    public ResponseEntity<?> findPlantManager(Integer id){
        var user= repository.findUserByPlantManagingId(id);
        if(user.isEmpty())return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(UserStructureDto.convertToUserStructureDto(user.get()), HttpStatus.OK);
    }

}
