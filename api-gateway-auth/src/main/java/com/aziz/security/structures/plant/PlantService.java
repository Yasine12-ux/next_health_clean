package com.aziz.security.structures.plant;

import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.plant.dto.CreateEditPlantDto;
import com.aziz.security.structures.plant.dto.PlantDTO;
import com.aziz.security.structures.product_section.Dto.FullProductSectionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlantService {
    private final PlantRepository plantRepository;


    public ResponseEntity<?> createPlant(String name) {
        if(plantRepository.findPlantByName(name).isPresent())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        var plant = new Plant(name);
        plantRepository.save(plant);
        return new ResponseEntity<>(CreateEditPlantDto.toCreateEditPlantDto(plant),HttpStatus.OK);
    }

    public ResponseEntity<?> editPlant(CreateEditPlantDto plantDTO) {
        var plant = plantRepository.findPlantById(plantDTO.id());
        if(plant.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if(!plant.get().name.equals(plantDTO.name())){
            if(plantRepository.existsPlantByName(plantDTO.name()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        var newPlant = CreateEditPlantDto.ToPlant(plantDTO);

        newPlant.setManager(plant.get().getManager());
        newPlant.setProductSections(plant.get().getProductSections());


        plantRepository.save(newPlant);
        return new ResponseEntity<>(PlantDTO.ToPlantDto(newPlant),HttpStatus.OK);
    }


    public ResponseEntity<List<PlantDTO>> findAllPlants() {
        List<PlantDTO> list= plantRepository.findAll().stream().map(PlantDTO::ToPlantDto).collect(Collectors.toList());
        return new ResponseEntity<>(list,HttpStatus.OK);
    }

    public ResponseEntity<List<CreateEditPlantDto>> findAllPlantsMiniRep() {
        List<CreateEditPlantDto> list= plantRepository.findAll().stream().map(CreateEditPlantDto::toCreateEditPlantDto).collect(Collectors.toList());
        return new ResponseEntity<>(list,HttpStatus.OK);
    }

    public ResponseEntity<?> deletePlant(Integer plantId) {
        var plant = plantRepository.findPlantById(plantId);
        if (!plant.get().getProductSections().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(plant.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        plantRepository.delete(plant.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
    public List<FullProductSectionDto> plantProductSections(Integer plantId){
        return plantRepository.findPlantById(plantId).get().getProductSections().stream().map(FullProductSectionDto::toFullProductSectionDto).toList();
    }
}
