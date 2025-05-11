package com.aziz.security.structures.segment.dto;

import com.aziz.security.structures.segment.Segment;

public record CreateSegmentDto(String plant, String productSection, String segment) {
    public static CreateSegmentDto toSegmentDto(Segment segment){
        return new CreateSegmentDto(segment.getProductSection().getPlant().getName(),segment.getProductSection().getName(),segment.getName());
    }
}
