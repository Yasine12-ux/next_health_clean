package com.aziz.security.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface NotifRepository extends JpaRepository<NotificationEntity, Long> {
    Integer countByIsReadFalseAndUserId(Long id);

    List<NotificationEntity> findAllByUserId(Long id);

    List<NotificationEntity> findAllByIsReadFalseAndUserId(Long id);
}