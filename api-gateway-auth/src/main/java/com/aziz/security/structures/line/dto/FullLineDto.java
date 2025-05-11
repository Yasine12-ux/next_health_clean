package com.aziz.security.structures.line.dto;


import com.aziz.security.structures.line.Line;

public record FullLineDto(String plant, String productSection  , String segmentName, Integer lineId, String lineName,String manager,Integer nbWorkers) {
    public static FullLineDto toFullLineDto(Line line){
        return new FullLineDto(line.getSegment().getProductSection().getPlant().getName(),line.getSegment().getProductSection().getName() ,line.getSegment().getName(), line.getId(), line.getName(),
                (line.getLineManager()==null)?null:line.getLineManager().getLastname()+" "+line.getLineManager().getFirstname(),
                (line.getWorkers()==null)?0: line.getWorkers().size());
    }
}
