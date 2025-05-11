package com.aziz.security.structures.product_section.Dto;

import com.aziz.security.structures.product_section.ProductSection;

public record CreateProductSectionDto(String plant, String productSection) {

    public static CreateProductSectionDto toProductSectionDto(ProductSection productSection) {
        return new CreateProductSectionDto(productSection.getPlant().getName(), productSection.getName());
    }
}
