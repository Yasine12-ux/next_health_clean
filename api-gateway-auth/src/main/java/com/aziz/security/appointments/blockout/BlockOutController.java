package com.aziz.security.appointments.blockout;

import com.aziz.security.appointments.blockout.dto.BlockOutClientDto;
import com.aziz.security.appointments.dto.CreateBlockOutDto;
import com.aziz.security.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/block-out")
@RequiredArgsConstructor
public class BlockOutController {
    private final JwtService jwtService;
    private final BlockOutService blockOutService;
    @PostMapping
    public ResponseEntity<?> createBlockOut(HttpServletRequest request,
                                            @RequestBody CreateBlockOutDto createBlockOutDto
    ) {
        var email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return blockOutService.createBlockOut(createBlockOutDto, email);
    }


    @PutMapping
    ResponseEntity<?> update(HttpServletRequest request,
            @RequestBody BlockOutClientDto blockOutDto
    ){
        var email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return blockOutService.updateBlockOut(blockOutDto,email);
    };

    @GetMapping("/all")
    ResponseEntity<?> findAllByPlant(HttpServletRequest request){
        var email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return blockOutService.findAllByPlant(email);
    };

    @DeleteMapping("/{id}")
    ResponseEntity<?> delete(HttpServletRequest request,
                             @PathVariable Integer id){
        var email = jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return blockOutService.delete(id,email);
    };

}
