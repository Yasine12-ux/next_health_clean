package com.aziz.security.structures.segment;


import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.line.dto.LineSimpleDto;
import com.aziz.security.structures.product_section.ProductSectionRepository;
import com.aziz.security.structures.segment.dto.CreateSegmentDto;
import com.aziz.security.structures.segment.dto.EditSegmentDto;
import com.aziz.security.structures.segment.dto.FullSegDto;
import com.aziz.security.structures.segment.dto.SegmentPathDto;
import com.aziz.security.user.UserService;
import com.aziz.security.user.user_strucutres.UserStructureService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SegmentService {
    private final SegmentRepository segmentRepository;
    private final ProductSectionRepository productSectionRepository;
    private final UserStructureService userStructureService;

    public Optional<Segment> findSegmentByNameAndPSNameAndByPlantName (String segmentName,String psName,String plantName){
        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(psName,plantName);
        if(productSection.isEmpty()) return Optional.empty();

        return segmentRepository.findSegmentByNameAndProductSectionId(segmentName, productSection.get().getId());
    }

    public void saveSegment(Segment segment) {
        segmentRepository.save(segment);
    }

    public List<FullSegDto> findAllSegments() {
        return segmentRepository.findAll().stream().map(FullSegDto::toFullSegmentDto).toList();
    }

    public ResponseEntity<?> createSegment(CreateSegmentDto createSegmentDto) {

        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(createSegmentDto.productSection(), createSegmentDto.plant());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);// the productSection section not found

        var segment = segmentRepository.findSegmentByNameAndProductSectionId(createSegmentDto.segment(), productSection.get().getId());
        if(segment.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);// the segment name used within that productSection section

        var segmentNew = Segment.builder()
                .name(createSegmentDto.segment())
                .productSection(productSection.get())
                .build();
        segmentRepository.save(segmentNew);
        return new ResponseEntity<>(EditSegmentDto.toEditSegmentDto(segmentNew),HttpStatus.OK);
    }


    public ResponseEntity<?> createManySegments(List<CreateSegmentDto> createSegmentDtoList) {
        if(createSegmentDtoList.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        if(createSegmentDtoList.size()==1) return createSegment(createSegmentDtoList.get(0));
        // at least two rows

        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(createSegmentDtoList.get(0).productSection(), createSegmentDtoList.get(0).plant());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);// the productSection section not found

        ArrayList<EditSegmentDto> response = new ArrayList<>();

        for(CreateSegmentDto createSegmentDto : createSegmentDtoList){
            if(!productSection.get().getName().equals(createSegmentDto.productSection())){
                productSection=productSectionRepository.findProductSectionByNameAndPlantName(createSegmentDto.productSection(), createSegmentDto.plant());
                if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // productSection section not exists
            }

            var segment = segmentRepository.findSegmentByNameAndProductSectionId(createSegmentDto.segment(), productSection.get().getId());
            if(segment.isPresent()) continue;

            var segmentNew = Segment.builder()
                    .name(createSegmentDto.segment())
                    .productSection(productSection.get())
                    .build();
            segmentRepository.save(segmentNew);
            response.add(EditSegmentDto.toEditSegmentDto(segmentNew));
        }
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
    public ResponseEntity<?> editSegment(EditSegmentDto segmentDto) {
        var segment = segmentRepository.findById(segmentDto.segmentId());
        if(segment.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var productSection = productSectionRepository.findProductSectionByNameAndPlantName(segmentDto.productSection(), segmentDto.plant());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);


        if (!segment.get().getName().equals(segmentDto.segmentName())
                || !segment.get().getProductSection().getName().equals(segmentDto.productSection())
                || !segment.get().getProductSection().getPlant().getName().equals(segmentDto.plant())
        ) {
            var segmentName = segmentRepository.findSegmentByNameAndProductSectionId(segmentDto.segmentName(), productSection.get().getId());
            if (segmentName.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        segment.get().setName(segmentDto.segmentName());
        segment.get().setProductSection(productSection.get());
        segmentRepository.save(segment.get());
        return new ResponseEntity<>(FullSegDto.toFullSegmentDto(segment.get()),HttpStatus.OK);
    }

    public ResponseEntity<?> deleteSegment(Integer segmentId) {
        var segment = segmentRepository.findById(segmentId);
        if (!segment.get().getLines().isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if(segment.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        segmentRepository.delete(segment.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
    public Optional<Segment> findSegmentByNameAndProductSectionId(String name, Integer productSectionId) {
        return segmentRepository.findSegmentByNameAndProductSectionId(name, productSectionId) ;
    }
    public List<StructureMiniDto> productSectionSegmentsMini(Integer productSectionId) {
        return segmentRepository.findByProductSectionId(productSectionId).stream().map(StructureMiniDto::toStructureMiniDto).toList();
    }

    public ResponseEntity<?> getSegmentPlantIdPsIdById(Integer segmentId){
        var segment = segmentRepository.findById(segmentId);
        if(segment.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(new SegmentPathDto(segment.get().getProductSection().getPlant().getId(),segment.get().getProductSection().getId()),HttpStatus.OK);
    }
}
