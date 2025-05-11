package com.aziz.security.notification;

import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NotificationService {
    private final NotifRepository notifRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate template;

//    public void saveNotif(String message) {
//        String[] allowedPermission = {"line ", "List de rdv ","RDV", "Dossier Medical"};
//        userRepository.findAll().forEach(user -> {
//// Check if user's permissions match any element in allowedPermission array
//            boolean hasAllowedPermission = user.getRole().getPermissions().stream()
//                    .anyMatch(permission -> Arrays.stream(allowedPermission)
//                            .anyMatch(allowed -> permission.getName().contains(allowed)));
//
//
//// If the user has at least one allowed permission, add the user to the notification
//            if (hasAllowedPermission) {
//                NotificationEntity notification = new NotificationEntity();
//                notification.setMessage(message);
//                notification.getUsers().add(user);
//                notifRepository.save(notification);
//            }
//        });
//    }

//    public String getNotif() {
//        template.convertAndSend("/topic/public", notifRepository.findAll());
////        return ResponseEntity.ok(notifRepository.findAll());
//    }


    //return count notification is read false by user email
    public Integer countNotif(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return notifRepository.countByIsReadFalseAndUserId(Long.valueOf(user.getId()));
        } else {
            throw new RuntimeException("User not found");
        }
    }

    //return all notification by user email
    public List<NotificationDto> getNotif(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return notifRepository.findAllByUserId(Long.valueOf(user.getId())).stream().map(NotificationDto::convertToDto).collect(Collectors.toList());
        } else {
            throw new RuntimeException("User not found");
        }
    }

    //find all isRead false notifications by user email
    public List<NotificationDto> getNotifUnread(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return notifRepository.findAllByIsReadFalseAndUserId(Long.valueOf(user.getId()))
                    .stream()
                    .map(NotificationDto::convertToDto)
                    .collect(Collectors.toList());


        } else {
            throw new RuntimeException("User not found");
        }
    }

    //change isRead to true
    public ResponseEntity<String> markAsRead(Long id) {
        Optional<NotificationEntity> optionalNotification = notifRepository.findById(id);
        if (optionalNotification.isPresent()) {
            NotificationEntity notification = optionalNotification.get();
            notification.setRead(true);
            notifRepository.save(notification);
            return ResponseEntity.ok("Notification marked as read");
        } else {
            return ResponseEntity.badRequest().body("Notification not found");
        }

    }


    public String findLineMaanger(Integer userId)
    {
        Optional<User> user=   userRepository.findById(userId);
        return user.get().getLineWorking().getLineManager().getEmail();

    }



    public ArrayList<String> findSegmentMaanger(Integer userId)
    {
        Optional<User> user=   userRepository.findById(userId);
        ArrayList<String> emails = new ArrayList<>();

        if (user.get().getLineWorking().getSegment().getSegmentManager()!=null)
            emails.add(user.get().getLineWorking().getSegment().getSegmentManager().getEmail());
        if (user.get().getLineWorking().getLineManager()!=null)
                emails.add(user.get().getLineWorking().getLineManager().getEmail());
        if (user.get().getLineWorking().getSegment().getHumanResources()!=null)
            emails.add(user.get().getLineWorking().getSegment().getHumanResources().getEmail());
        if (user.get().getLineWorking().getSegment().getProductSection().getPlant().getNurses().toArray().length>0)
        {
            for(int i=0;i<user.get().getLineWorking().getSegment().getProductSection().getPlant().getNurses().toArray().length; i++)
            {
                emails.add(user.get().getLineWorking().getSegment().getProductSection().getPlant().getNurses().get(i).getEmail());
            }
        }
        for (int i=0;i<emails.size(); i++)
        {
           System.out.println(emails.get(i));
        }
        return emails;
    }


    public void sendNotificationToUser(Integer id ,String message) {
        ArrayList<String> emails = findSegmentMaanger(id);
        for (String email : emails) {
            Optional<User> user = userRepository.findByEmail(email);
            System.out.println(user.get().getEmail());
            if (user.isPresent()) {
                NotificationEntity notification = new NotificationEntity();
                notification.setMessage(message);
                notification.setDate(LocalDateTime.now());
                notification.setUser(user.get());
                notifRepository.save(notification);
                template.convertAndSendToUser(user.get().getEmail(), "/queue/notification", notification.getId() + "/" + notification.getMessage() + "/" + LocalDateTime.now());
            }
        }
    }
}