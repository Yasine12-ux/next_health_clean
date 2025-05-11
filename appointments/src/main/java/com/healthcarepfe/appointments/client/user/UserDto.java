package com.healthcarepfe.appointments.client.user;


import lombok.*;



@Builder

public record UserDto(String Name ,String email) {
    public static UserDto toUserDto(User user){
        return new UserDto(user.getFirstname(),user.getEmail());
    }
    public static User toUser(UserDto userDto){
        return User.builder()
                .firstname(userDto.Name())
                .email(userDto.email())
                .build();
    }

}
