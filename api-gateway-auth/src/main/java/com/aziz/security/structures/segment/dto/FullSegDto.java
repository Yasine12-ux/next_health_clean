package com.aziz.security.structures.segment.dto;


import com.aziz.security.structures.segment.Segment;

public record FullSegDto(Integer segmentId, String segmentName , Integer lineCount , String productSection,String manager,String rh, String plant) {
        public static FullSegDto toFullSegmentDto(Segment segment){
            return new FullSegDto(segment.getId(), segment.getName(), segment.getLines().size(),segment.getProductSection().getName(),
                    (segment.getSegmentManager()==null)? null:segment.getSegmentManager().getLastname()+" "+segment.getSegmentManager().getFirstname(),
                    (segment.getHumanResources()==null)? null:segment.getHumanResources().getLastname()+" "+segment.getHumanResources().getFirstname(),
                    segment.getProductSection().getPlant().getName());
        }
}
