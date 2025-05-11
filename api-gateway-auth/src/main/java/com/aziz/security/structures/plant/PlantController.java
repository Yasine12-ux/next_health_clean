package com.aziz.security.structures.plant;

import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.plant.dto.CreateEditPlantDto;
import com.aziz.security.structures.plant.dto.PlantDTO;
import com.aziz.security.structures.product_section.Dto.FullProductSectionDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/structures/plants")
@RequiredArgsConstructor
public class PlantController {
    private final PlantService plantService;
    @Operation(summary = "✅ : create plant ")
    @PostMapping("/plant/{plantName}")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    ResponseEntity<?> createPlant(
            @PathVariable String plantName){
        return plantService.createPlant(plantName);
    }
    @PutMapping("/plant")
    @PreAuthorize("hasAuthority('STRUCTURE_MANAGEMENT')")
    @Operation(summary = "✅ : modify plant ")
    ResponseEntity<?> editPlant(@RequestBody CreateEditPlantDto plantDTO){
        return plantService.editPlant(plantDTO);
    }

    @Operation(summary = "✅ : get all plants ")
    @GetMapping("/plants")
    ResponseEntity<List<PlantDTO>> findAllPlants(){
        return plantService.findAllPlants();
    }
    @Operation(summary = "✅ : get all plants with minimum representation (name & id) ")
    @GetMapping("/plants-mini")
    ResponseEntity<List<CreateEditPlantDto>> findAllPlantsSimpleRep(){
        return plantService.findAllPlantsMiniRep();
    }
    @Operation(summary = "✅ : delete plant ")
    @DeleteMapping("/plant/{plantId}")
    ResponseEntity<?> deletePlant(@PathVariable Integer plantId){
        return plantService.deletePlant(plantId);
    }
    @Operation(summary = "✅ : get all product sections by plant ")
    @GetMapping("/plant-product-sections/{plantId}")
    List<FullProductSectionDto> plantProductSections(@PathVariable Integer plantId){
        return plantService.plantProductSections(plantId);
    }
}
