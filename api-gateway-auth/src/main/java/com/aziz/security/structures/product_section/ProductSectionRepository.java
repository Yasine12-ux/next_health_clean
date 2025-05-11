package com.aziz.security.structures.product_section;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductSectionRepository extends JpaRepository<ProductSection,String> {
    public Optional<ProductSection> findProductSectionByNameAndPlantId(String name,Integer plantId);
    public Optional<ProductSection> findProductSectionByNameAndPlantName(String productSectionName,String plantName);
    public Optional<ProductSection> findProductSectionById(Integer id);
    //find  by name
    public Optional<ProductSection> findProductSectionByName(String name);

    public List<ProductSection> findProductSectionByPlantId(Integer id);
}
