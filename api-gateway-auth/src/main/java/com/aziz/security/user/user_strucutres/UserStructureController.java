package com.aziz.security.user.user_strucutres;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users-structures")
@RequiredArgsConstructor
public class UserStructureController {
    private final UserStructureService userStructureService;

    @Operation(summary = "✅:get all users working in line")
    @GetMapping("/line-workers/{lineId}")
    public ResponseEntity<?> findAllLineWorkers(@PathVariable Integer lineId){
        return userStructureService.findAllLineWorkers(lineId);
    }

//    @Operation(summary = "✅:get line manager(contermaîte)")
//    @GetMapping("/line-manager/{lineId}")
//    public ResponseEntity<?> findLineManager(@PathVariable Integer lineId){
//        return userStructureService.findLineManager(lineId);
//    }
    @Operation(summary = "✅:get Segment manager(chef segment)")
    @GetMapping("/segment-manager/{segmentId}")
    public ResponseEntity<?> findSegmentManager(@PathVariable Integer segmentId){
        return userStructureService.findSegmentManager(segmentId);
    }
    @Operation(summary = "✅:get Product Section manager")
    @GetMapping("/product-section-manager/{productSectionId}")
    public ResponseEntity<?> findProductSectionManager(@PathVariable Integer productSectionId){
        return userStructureService.findProductSectionManager(productSectionId);
    }
    @Operation(summary = "✅:get Plant manager")
    @GetMapping("/plant-manager/{plantId}")
    public ResponseEntity<?> findPlantManager(@PathVariable Integer plantId){
        return userStructureService.findPlantManager(plantId);
    }

}
