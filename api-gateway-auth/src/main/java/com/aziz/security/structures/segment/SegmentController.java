package com.aziz.security.structures.segment;


import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.segment.dto.CreateSegmentDto;
import com.aziz.security.structures.segment.dto.EditSegmentDto;
import com.aziz.security.structures.segment.dto.FullSegDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/structures/segments")
@RequiredArgsConstructor
public class SegmentController {
    private final SegmentService segmentService;

    @Operation(summary = "✅ : create segment ")
    @PostMapping("/segment")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")

    ResponseEntity<?> createSegment(
            @RequestBody CreateSegmentDto createSegmentDto) {
        return segmentService.createSegment(createSegmentDto);
    }

    @Operation(summary = "✅ : create many segment(for excel) ")
    @PostMapping("/segment-many")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    public ResponseEntity<?> createManySegments(@RequestBody List<CreateSegmentDto> productSectionDtoList) {
        return segmentService.createManySegments(productSectionDtoList);
    }

    @Operation(summary = "✅ : get all segments ")
    @GetMapping("/all-segments")
    List<FullSegDto> allSegments() {
        return segmentService.findAllSegments();
    }

    @Operation(summary = "✅ : edit segment ")
    @PutMapping("/segment")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> editSegment(
            @RequestBody EditSegmentDto segmentDto) {
        return segmentService.editSegment(segmentDto);
    }

    @Operation(summary = "✅ : delete segment ")
    @DeleteMapping("/segment/{segmentId}")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> deleteSegment(@PathVariable Integer segmentId) {
        return segmentService.deleteSegment(segmentId);
    }


    @Operation(summary = "✅ : find all segments by product section mini rep")
    @GetMapping("/product-section-segments-mini/{productSectionId}")
    List<StructureMiniDto> productSectionSegmentsMini(@PathVariable Integer productSectionId) {
        return segmentService.productSectionSegmentsMini(productSectionId);
    }

    @Operation()
    @GetMapping("/segment-path/{segmentId}")
    public ResponseEntity<?> getSegmentPlantIdPsIdById(@PathVariable Integer segmentId) {
        return segmentService.getSegmentPlantIdPsIdById(segmentId);
    }
}
