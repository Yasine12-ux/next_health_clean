package com.healthcarepfe.appointments.Appointment.BlockOut;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/block-out")
public class BlockOutController {
    private final BlockOutService blockOutService;

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody CreateBlockOutDto createBlockOutDto
    ){
        return this.blockOutService.addBlockOut(createBlockOutDto);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(
            @PathVariable Integer id
    ){
        return blockOutService.deleteBlockOut(id);
    }

    @PutMapping
    ResponseEntity<BlockOut> update(
            @RequestBody BlockOut blockOutDto
    ){
        return blockOutService.update(blockOutDto);
    };

    @GetMapping("{id}")
    ResponseEntity<List<BlockOut>> findAllByPlant(@RequestParam Integer id ){
        return blockOutService.findAllByPlant(id);

    };

}
