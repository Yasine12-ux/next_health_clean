package com.healthcarepfe.appointments.client.user;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private Boolean enable;
    private String phone;
    private String role;
}
