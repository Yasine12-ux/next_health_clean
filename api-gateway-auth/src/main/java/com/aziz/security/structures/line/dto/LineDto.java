package com.aziz.security.structures.line.dto;

import com.aziz.security.structures.line.Line;

public record LineDto(String plant, String productSection, String segment, String line) {
    public static LineDto toLineDto(Line line){
        return new LineDto(line.getSegment().getProductSection().getPlant().getName(),line.getSegment().getProductSection().getName(),line.getSegment().getName(),line.getName());
    }
}
