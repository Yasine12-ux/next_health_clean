package com.aziz.security.notification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public record NotificationDto(
        Long id,
        String message,
        boolean isRead,
        LocalDateTime time
) {
    public static NotificationDto convertToDto(NotificationEntity notificationEntity) {
        return new NotificationDto(
                notificationEntity.getId(),
                notificationEntity.getMessage(),
                notificationEntity.getIsRead(),
                notificationEntity.getDate()
        );
    }
}
