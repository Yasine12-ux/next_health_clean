package com.aziz.security.structures.plant.dto;


import com.aziz.security.structures.plant.Plant;

public record CreateEditPlantDto(
    Integer id,
    String name)
{

    public static CreateEditPlantDto toCreateEditPlantDto(Plant plant){
        return new CreateEditPlantDto(plant.getId(),plant.getName());
    }

    public static Plant ToPlant(CreateEditPlantDto plantDTO) {
        return Plant.builder()
                .id(plantDTO.id())
                .name(plantDTO.name())
                .build();
    }
}
