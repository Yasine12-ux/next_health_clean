
package com.aziz.security.structures.plant.dto;

import com.aziz.security.structures.plant.Plant;

public record PlantDTO(Integer id,
                       String name,
                       String manager,
                       Integer productSectionsCount,
                       Integer segmentsCount,
                       Integer linesCount) {
    public static PlantDTO ToPlantDto(Plant plant){
        return new PlantDTO(plant.getId(),plant.getName(),(plant.getManager()!=null)?plant.getManager().getLastname()+" "+plant.getManager().getFirstname():null,
                (plant.getProductSections()==null)?0:plant.getProductSections().size(),
                (plant.getProductSections()==null)?0:plant.getProductSections().stream().mapToInt(productSection -> (productSection.getSegments()==null)?0:productSection.getSegments().size()).sum(),
                (plant.getProductSections()==null)?0:plant.getProductSections().stream().mapToInt(productSection -> (productSection.getSegments()==null)?0:productSection.getSegments().stream().mapToInt(segment ->(segment.getLines()==null)?0: segment.getLines().size()).sum()).sum());
    }
    public static Plant ToPlant(PlantDTO plantDTO){
        return Plant.builder()
                .id(plantDTO.id())
                .name(plantDTO.name())
                .build();
    }
}
