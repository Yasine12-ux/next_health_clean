package com.aziz.security.user.dto.resetPass;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResetChangePassword {
    private String email;
    private String newPassword;
    private String confirmationPassword;
    private String code;
}
