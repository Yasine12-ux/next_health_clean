package com.aziz.security.user.dto;

import com.aziz.security.user.User;

public record UserDTO(Integer id,
                      String firstname,
                      String lastname,
                      String email,
                      String phone,
                      String role,
                      Boolean isEnable,
                      Boolean isArchived) {
    public static UserDTO convertToUserDto(User user){
        return new UserDTO(user.getId(), user.getFirstname(), user.getLastname(),user.getEmail(), user.getPhone(), user.getRole().getName(),user.isEnabled(),user.getArchived());
    }
    public static User convertToUser(UserDTO userDTO){
        return User.builder()
                .id(userDTO.id())
                .firstname(userDTO.firstname())
                .lastname(userDTO.lastname())
                .email(userDTO.email())
                .phone(userDTO.phone())
                .enable(userDTO.isEnable)
                .archived(userDTO.isArchived)
                .build();
    }
}
