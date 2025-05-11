package com.aziz.security.user.dto;

import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FullUserDto(
          UserDTO userInfo,
          List<Integer> plantsManagingIds,
          List<Integer> productSectionsManagingIds,
          List<Integer> segmentsManagingIds,
          List<Integer> resourceHumanSegmentsIds,
          Integer plantDoctorId,
          Integer plantNurseId,
          List<Integer> linesManagingIds,
          Integer lineWorkingId
    )
{
    public static FullUserDto convertToFullUserDto(User user){

        var userPlantsManaging =  user.getPlantManaging().stream().map(Plant::getId).collect(Collectors.toList());
        var userPSsManaging = user.getProductSectionManaging().stream().map(ProductSection::getId).collect(Collectors.toList());
        var userSegmentsManaging = user.getSegmentManaging().stream().map(Segment::getId).collect(Collectors.toList());
        var userSegmentsAsRH = user.getResourceHumanSegment().stream().map(Segment::getId).collect(Collectors.toList());
        var userSegmentsAsDoctor = (user.getPlantDoctor()!=null)?user.getPlantDoctor().getId():null;
        var userSegmentsAsNurse = (user.getPlantNurse()!=null)?user.getPlantNurse().getId():null;
        var userLinesManaging = user.getLineManaging().stream().map(Line::getId).collect(Collectors.toList());
        var userLineWorking = (user.getLineWorking()!=null)?
                user.getLineWorking().getId():null;
        return new FullUserDto(UserDTO.convertToUserDto(user),userPlantsManaging,userPSsManaging,userSegmentsManaging,userSegmentsAsRH,userSegmentsAsDoctor,userSegmentsAsNurse,userLinesManaging,userLineWorking);
    }


}
