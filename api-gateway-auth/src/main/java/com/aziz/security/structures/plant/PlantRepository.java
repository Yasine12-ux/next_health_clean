package com.aziz.security.structures.plant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlantRepository extends JpaRepository<Plant,Integer> {
    public Optional<Plant> findPlantById(Integer id);
     public Boolean existsPlantByName(String name);
     //find by name
        public Optional<Plant> findPlantByName(String name);
    public boolean existsPlantById(Integer id);
}
