package com.aziz.security.structures.segment.dto;

import com.aziz.security.structures.segment.Segment;

public record EditSegmentDto(String plant, String productSection, Integer segmentId, String segmentName) {
    public static EditSegmentDto toEditSegmentDto(Segment segment){
        return new EditSegmentDto(
                segment.getProductSection().getPlant().getName(),
                segment.getProductSection().getName(),
                segment.getId(),
                segment.getName()
        );
    }
}
