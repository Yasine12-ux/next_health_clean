package com.aziz.security.structures.line;

import com.aziz.security.structures.line.dto.FullLineDto;
import com.aziz.security.structures.line.dto.LineDto;
import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.line.dto.LineSimpleDto;
import com.aziz.security.user.user_strucutres.dto.UserStructureDto;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/structures/lines")
@RequiredArgsConstructor
public class LineController {
    private final LineService lineService;

    @GetMapping("/line-workers/{lineId}")
    @Operation(summary = "✅ : find all workers of line")
    ResponseEntity<List<UserStructureDto>> lineWorkers(@PathVariable Integer lineId) {
        return lineService.lineWorkers(lineId);
    }

    @PostMapping("/line")
    @Operation(summary = "✅ : create line")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> createLine(
            @RequestBody LineDto lineDto) {
        return lineService.createLine(lineDto);
    }

    @Operation(summary = "✅ : create many line(for excel) ")
    @PostMapping("/line-many")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    public ResponseEntity<?> createManyLines(@RequestBody List<LineDto> productSectionDtoList) {
        return lineService.createManyLines(productSectionDtoList);
    }

    @Operation(summary = "✅ : get all lines")
    @GetMapping("/lines")
    public List<FullLineDto> allLines() {
        return lineService.findAllLines();
    }

    @Operation(summary = "✅ : get all lines by segment")
    @GetMapping("/lines/{segmentId}/{segmentName}")
    public Optional<Line> allLinesBySegment(@PathVariable Integer segmentId, @PathVariable String segmentName) {
        return lineService.findAllLinesBySegment(segmentId, segmentName);
    }

    @Operation(summary = "✅ : get all lines by segment")
    @GetMapping("/lines-mini/{segmentId}")
    public List<StructureMiniDto> allLinesBySegmentMini(@PathVariable Integer segmentId) {
        return lineService.findAllLinesBySegmentMniRep(segmentId);
    }

    @Operation(summary = "✅ : edit line")
    @PutMapping("/line")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> editLine(
            @RequestBody LineSimpleDto lineDto) {
        return lineService.editLine(lineDto);
    }

    @Operation(summary = "✅ : delete line")
    @DeleteMapping("/line/{lineId}")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> deleteLine(@PathVariable Integer lineId) {
        return lineService.deleteLine(lineId);
    }

    @Operation(summary = "✅ : get line path")
    @GetMapping("/line-path/{lineId}")
    public ResponseEntity<?> getLinePathById(@PathVariable Integer lineId) {
        return lineService.getLinePathById(lineId);
    }
}
