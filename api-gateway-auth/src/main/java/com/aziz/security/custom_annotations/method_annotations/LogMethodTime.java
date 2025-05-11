package com.aziz.security.custom_annotations.method_annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface LogMethodTime {
    String message() default ""; // Default message for logging
    LogLevel level() default LogLevel.INFO; // Default log level
}
enum LogLevel {
    INFO, WARN, ERROR;
}
