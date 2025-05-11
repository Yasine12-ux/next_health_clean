package com.aziz.security.structures.product_section.Dto;

import com.aziz.security.structures.product_section.ProductSection;

public record FullProductSectionDto(Integer productSectionId,
                                    String plantName, String name,
                                    Integer SegmentCount,
                                    String manager) {




    public static FullProductSectionDto toFullProductSectionDto(ProductSection productSection){
        return new FullProductSectionDto( productSection.getId(),
                productSection.getPlant().getName(),
                productSection.getName(),
                productSection.getSegments().size(),
                (productSection.getManager()!=null)?productSection.getManager().getLastname()+" "+productSection.getManager().getFirstname():null
                );
    }


}
