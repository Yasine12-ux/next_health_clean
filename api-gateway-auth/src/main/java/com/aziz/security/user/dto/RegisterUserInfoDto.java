package com.aziz.security.user.dto;

import com.aziz.security.user.User;

public record RegisterUserInfoDto(
        String firstname,
         String lastname,
         String email,
         String phone,
         String password,
         String role
){
    public static User convertToUser(RegisterUserInfoDto registerUserInfoDto){
        return User.builder()
                .firstname(registerUserInfoDto.firstname())
                .lastname(registerUserInfoDto.lastname())
                .email(registerUserInfoDto.email())
                .phone(registerUserInfoDto.phone())
                .build();
    }
}
