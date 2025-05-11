package com.aziz.security.notification;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {


    private final NotificationService notificationService;
    private final SimpMessagingTemplate template;

    @Autowired
    public NotificationController(NotificationService notificationService, SimpMessagingTemplate template) {
        this.notificationService = notificationService;
        this.template = template;
    }


    //change markAsRead
    @Operation(summary = "change from unread to read")
    @PutMapping("/change/{id}")
    public ResponseEntity<String> changeNotif(@PathVariable Long id) {
      return   notificationService.markAsRead(id);
    }


@Operation(summary = "Get all unread notifications")
    @GetMapping("/notificationsFalse/{email}")
    public ResponseEntity<List<NotificationDto>> getNotifFalse(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotifUnread(email));
    }

    @Operation(summary = "Get count unread notifications")
     @GetMapping("/count/{email}")
     public Integer countNotification(@PathVariable String email) {
         return notificationService.countNotif(email);
     }


     @Operation(summary = "Get all notifications")
     @GetMapping("/all/{email}")
     public List<NotificationDto> getNotification(@PathVariable String email) {
         return notificationService.getNotif(email);
     }

}