package com.aziz.security.user.user_strucutres.dto;

import com.aziz.security.user.User;

public record UserStructureDto(Integer id, String firstname, String lastname) {
    public static UserStructureDto convertToUserStructureDto(User user){
        return new UserStructureDto(user.getId(), user.getFirstname(), user.getLastname());
    }
}
