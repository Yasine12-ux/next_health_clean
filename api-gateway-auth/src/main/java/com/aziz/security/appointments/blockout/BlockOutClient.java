package com.aziz.security.appointments.blockout;

import com.aziz.security.appointments.blockout.dto.BlockOutClientDto;
import com.aziz.security.appointments.blockout.dto.CreateBlockOutClientDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "appointments-blockout-service",url = "${application.config.appointments-url}/block-out")
public interface BlockOutClient {
    @PostMapping
    ResponseEntity<BlockOutClientDto> create(
            @RequestBody CreateBlockOutClientDto createBlockOutDto
    );

    @PutMapping
    ResponseEntity<BlockOutClientDto> update(
            @RequestBody BlockOutClientDto blockOutDto
    );

    @GetMapping("{id}")
    ResponseEntity<List<BlockOutClientDto>> findAllByPlant(@RequestParam Integer id );

    @DeleteMapping("{id}")
    ResponseEntity<?> delete(@PathVariable Integer id);
}
