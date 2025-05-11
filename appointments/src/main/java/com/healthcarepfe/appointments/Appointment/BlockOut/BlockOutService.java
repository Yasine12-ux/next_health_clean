package com.healthcarepfe.appointments.Appointment.BlockOut;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlockOutService {
    private final BlockOutRepository blockOutRepository;


    public ResponseEntity<?> addBlockOut(CreateBlockOutDto createBlockOutDto){
        final var blockOut = CreateBlockOutDto.toBlockOut(createBlockOutDto);
        var x =blockOutRepository.save(blockOut);
        return new ResponseEntity<>(x, HttpStatus.CREATED);
    }
    public ResponseEntity<?>  deleteBlockOut(Integer id){
        blockOutRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<BlockOut> update(BlockOut blockOutDto) {
        return new ResponseEntity<>(blockOutRepository.save(blockOutDto),HttpStatus.OK);
    }

    public ResponseEntity<List<BlockOut>> findAllByPlant(Integer id) {
        return new ResponseEntity<>(blockOutRepository.findAllByPlantId(id),HttpStatus.OK) ;
    }
}
