package com.aziz.security.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public record FullCreateUserDto(
          RegisterUserInfoDto userInfo,
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

}
