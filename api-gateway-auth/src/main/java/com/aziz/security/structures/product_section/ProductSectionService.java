package com.aziz.security.structures.product_section;


import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.plant.PlantRepository;
import com.aziz.security.structures.plant.PlantService;
import com.aziz.security.structures.product_section.Dto.CreateProductSectionDto;
import com.aziz.security.structures.product_section.Dto.FullProductSectionDto;
import com.aziz.security.structures.product_section.Dto.ProductSectionDto;
import com.aziz.security.structures.segment.dto.FullSegDto;
import com.aziz.security.user.UserRepository;
import com.aziz.security.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSectionService {
    private final ProductSectionRepository productSectionRepository;
    private final PlantRepository plantRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PlantService plantService;

    public List<FullProductSectionDto> findAllProductSections() {
        return productSectionRepository.findAll().stream().map(FullProductSectionDto::toFullProductSectionDto).toList();
    }
    public ResponseEntity<?> createProductSection(CreateProductSectionDto createProductSectionDto) {
        var plant = plantRepository.findPlantByName(createProductSectionDto.plant());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var productSection = productSectionRepository.findProductSectionByNameAndPlantId(createProductSectionDto.productSection(), plant.get().getId());
        if(productSection.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        ProductSection productSectionNew = new ProductSection(createProductSectionDto.productSection(), plant.get());
        productSectionRepository.save(productSectionNew);

        return new ResponseEntity<>(ProductSectionDto.toProductSectionDto(productSectionNew),HttpStatus.OK);

    }

    public ResponseEntity<?> createManyProductSections(List<CreateProductSectionDto> fullproductSectionDtoList){
        if(fullproductSectionDtoList.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        if(fullproductSectionDtoList.size()==1) return createProductSection(fullproductSectionDtoList.get(0));
        // at least two rows
        var plant = plantRepository.findPlantByName(fullproductSectionDtoList.get(0).plant());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        ArrayList<ProductSectionDto> response = new ArrayList<>();

        for(CreateProductSectionDto createProductSectionDto:fullproductSectionDtoList){
            if(!plant.get().getName().equals(createProductSectionDto.plant())){
                plant = plantRepository.findPlantByName(createProductSectionDto.plant());
                if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            var productSection = productSectionRepository.findProductSectionByNameAndPlantId(createProductSectionDto.productSection(), plant.get().getId());
            if(productSection.isPresent()) continue;

            ProductSection productSectionNew = new ProductSection(createProductSectionDto.productSection(), plant.get());
            productSectionRepository.save(productSectionNew);
            response.add(ProductSectionDto.toProductSectionDto(productSectionNew));
        }
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    public ResponseEntity<?> editProductSection(ProductSectionDto productSectionDto) {
        var productSection = productSectionRepository.findProductSectionById(productSectionDto.productSectionId());
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var plant = plantRepository.findPlantByName(productSectionDto.plant());
        if(plant.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        if(!productSection.get().getName().equals(productSectionDto.productSection())|| !productSectionDto.plant().equals(productSection.get().getPlant().getName())){
            var productSectionName = productSectionRepository.findProductSectionByNameAndPlantId(productSectionDto.productSection(), plant.get().getId());
            System.out.println(productSectionName.isPresent()+" "+productSectionDto.productSection());
            if(productSectionName.isPresent()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        productSection.get().setName(productSectionDto.productSection());
        productSection.get().setPlant(plant.get());
        productSectionRepository.save(productSection.get());
        return new ResponseEntity<>(FullProductSectionDto.toFullProductSectionDto(productSection.get()),HttpStatus.OK);
    }

    public ResponseEntity<?> deleteProductSection(Integer productSectionId) {
        var productSection = productSectionRepository.findProductSectionById(productSectionId);
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (!productSection.get().getSegments().isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        productSectionRepository.delete(productSection.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
    public List<FullSegDto> productSectionSegments(Integer productSectionId) {
        return productSectionRepository.findProductSectionById(productSectionId).get().getSegments().stream().map(FullSegDto::toFullSegmentDto).toList();
    }


    public List<StructureMiniDto> plantProductSectionsMiniRep(Integer plantId){
        return productSectionRepository.findProductSectionByPlantId(plantId).stream().map(StructureMiniDto::toStructureMiniDto).toList();
    }

    public ResponseEntity<?> getPsPlantIdById(Integer productSectionId){
        var productSection = productSectionRepository.findProductSectionById(productSectionId);
        if(productSection.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(productSection.get().getPlant().getId(),HttpStatus.OK);
    }

    public ResponseEntity<?> getMiniProductSectionsByNurse(String email) {
        var user = userRepository.findByEmail(email);
        if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if(user.get().getPlantNurse()==null)return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        return new ResponseEntity<>(plantService.plantProductSections(user.get().getPlantNurse().getId()),HttpStatus.OK);
    }
}
