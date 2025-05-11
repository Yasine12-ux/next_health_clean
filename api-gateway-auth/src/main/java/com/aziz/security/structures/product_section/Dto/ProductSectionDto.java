package com.aziz.security.structures.product_section.Dto;


import com.aziz.security.structures.product_section.ProductSection;

public record ProductSectionDto(String plant, String productSection, Integer productSectionId) {
    public static ProductSectionDto toProductSectionDto(ProductSection productSection){
        return new ProductSectionDto(productSection.getPlant().getName(), productSection.getName(),productSection.getId());
    }
}
