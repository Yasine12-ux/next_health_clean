package com.aziz.security.structures.line.dto;

import com.aziz.security.structures.line.Line;

public record LineSimpleDto(String plant, String productSection,String segment, String line, Integer lineId) {
    public static LineSimpleDto toLineSimpleDto(Line line){
        return new LineSimpleDto(
                line.getSegment().getProductSection().getPlant().getName(),
                line.getSegment().getProductSection().getName(),
                line.getSegment().getName(),
                line.getName(),
                line.getId()
        );
    }
}
