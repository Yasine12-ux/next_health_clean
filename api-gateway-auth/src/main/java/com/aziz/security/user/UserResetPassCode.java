package com.aziz.security.user;

import org.apache.commons.lang3.RandomStringUtils;

import java.util.UUID;

public class UserResetPassCode {
    public static String getCode()
    {     return RandomStringUtils.randomAlphanumeric(6);

    }
}
