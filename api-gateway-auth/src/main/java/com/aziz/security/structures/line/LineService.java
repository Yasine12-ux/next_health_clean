package com.aziz.security.structures.line;


import com.aziz.security.structures.line.dto.FullLineDto;
import com.aziz.security.structures.line.dto.LineDto;
import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.line.dto.LinePathDto;
import com.aziz.security.structures.line.dto.LineSimpleDto;
import com.aziz.security.structures.product_section.ProductSectionRepository;
import com.aziz.security.structures.segment.SegmentRepository;
import com.aziz.security.structures.segment.SegmentService;
import com.aziz.security.structures.segment.dto.SegmentPathDto;
import com.aziz.security.user.user_strucutres.UserStructureService;
import com.aziz.security.user.user_strucutres.dto.UserStructureDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LineService {
    private final LineRepository lineRepository;
    private final SegmentRepository segmentRepository;
    private final SegmentService segmentService;
    private final ProductSectionRepository productSectionRepository;
    private final UserStructureService userStructureService;

    public Optional<Line> findLineByNameAndSegmentNameAndPSNameAndByPlantName (String lineName,String segmentName, String psName, String plantName){
        var segment= segmentService.findSegmentByNameAndPSNameAndByPlantName(segmentName,psName,plantName);
        if(segment.isEmpty()) return Optional.empty();

        return lineRepository.findLineByNameAndSegmentId(lineName,segment.get().getId());

    }

    public  ResponseEntity<?>  createLine(LineDto lineDto) {
        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(lineDto.productSection(), lineDto.plant());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var segment = segmentRepository.findSegmentByNameAndProductSectionId(lineDto.segment(), productSection.get().getId());
        if(segment.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var line = lineRepository.findLineByNameAndSegmentId(lineDto.line(),segment.get().getId());
        if(line.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var lineNew = Line.builder()
                .segment(segment.get())
                .name(lineDto.line())
                .build();
        lineRepository.save(lineNew);
        return new ResponseEntity<>(LineSimpleDto.toLineSimpleDto(lineNew),HttpStatus.OK);

    }
    public ResponseEntity<?> createManyLines(List<LineDto> lineDtoList) {
        if (lineDtoList.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        var response = new ArrayList<LineSimpleDto>();

        for (LineDto lineDto : lineDtoList) {
            var productSectionOptional = productSectionRepository.findProductSectionByNameAndPlantName(lineDto.productSection(), lineDto.plant());
            if (productSectionOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            var productSection = productSectionOptional.get();

            var segmentOptional = segmentRepository.findSegmentByNameAndProductSectionId(lineDto.segment(), productSection.getId());
            if (segmentOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            var segment = segmentOptional.get();

            var existingLineOptional = lineRepository.findLineByNameAndSegmentId(lineDto.line(), segment.getId());
            if (existingLineOptional.isPresent()) {
                continue;
            }

            var newLine = Line.builder()
                    .segment(segment)
                    .name(lineDto.line())
                    .build();
            lineRepository.save(newLine);
            response.add(LineSimpleDto.toLineSimpleDto(newLine));
        }

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



    public List<FullLineDto> findAllLines() {
        return lineRepository.findAll().stream().map(FullLineDto::toFullLineDto).toList();
    }

    private static LineDto ConverttoLineDto(Line line) {
        return new LineDto(line.getSegment().getProductSection().getPlant().getName(),line.getSegment().getProductSection().getName(),line.getSegment().getName(),line.getName());
    }

    public Optional<Line> findAllLinesBySegment(Integer segmentId, String segmentName) {
        return lineRepository.findLineByNameAndSegmentId(segmentName, segmentId);
    }

    public List<StructureMiniDto> findAllLinesBySegmentMniRep(Integer segmentId) {
        return lineRepository.findLinesBySegmentId(segmentId).stream().map(StructureMiniDto::toStructureMiniDto).collect(Collectors.toList());
    }

    public ResponseEntity<?> editLine(LineSimpleDto lineDto) {
        var line = lineRepository.findById(lineDto.lineId());
        if(line.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var plant = productSectionRepository.findProductSectionByNameAndPlantName(lineDto.productSection(), lineDto.plant());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(lineDto.productSection(), lineDto.plant());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var segment = segmentRepository.findSegmentByNameAndProductSectionId(lineDto.segment(), productSection.get().getId());
        if(segment.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if(line.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (!line.get().getName().equals(lineDto.line())
                || !line.get().getSegment().getName().equals(lineDto.segment())
                || !line.get().getSegment().getProductSection().getName().equals(lineDto.productSection())
                || !line.get().getSegment().getProductSection().getPlant().getName().equals(lineDto.plant())
        ) {
            var lineName = lineRepository.findLineByNameAndSegmentId(lineDto.line(), segment.get().getId());
            if (lineName.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        line.get().setName(lineDto.line());
        line.get().setSegment(segment.get());
        lineRepository.save(line.get());
        return new ResponseEntity<>(FullLineDto.toFullLineDto(line.get()),HttpStatus.OK);
    }

    public ResponseEntity<?> deleteLine(Integer lineId) {
        var line = lineRepository.findById(lineId);
        if(line.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        lineRepository.delete(line.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
    ResponseEntity<List<UserStructureDto>> lineWorkers(Integer lineId){
        return userStructureService.findAllLineWorkers(lineId);
    }

    public ResponseEntity<?> getLinePathById(Integer lineId){
        var line = lineRepository.findById(lineId);
        if(line.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(new LinePathDto(line.get().getSegment().getProductSection().getPlant().getId(),line.get().getSegment().getProductSection().getId(),line.get().getSegment().getId()),HttpStatus.OK);
    }
}
