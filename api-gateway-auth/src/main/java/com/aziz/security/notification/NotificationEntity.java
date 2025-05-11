package com.aziz.security.notification;


import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String message;
    private boolean isRead = false;
    private LocalDateTime date;
    @ManyToOne
    private User user;

    public boolean getIsRead(){
        return isRead;
    }
}
