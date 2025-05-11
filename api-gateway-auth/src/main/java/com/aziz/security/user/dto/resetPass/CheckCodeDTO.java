package com.aziz.security.user.dto.resetPass;

import lombok.Data;

@Data
public class CheckCodeDTO {
    private String code;
    private String email;


    public CheckCodeDTO(String email, String code) {
        this.email = email;
        this.code = code;
    }
}
