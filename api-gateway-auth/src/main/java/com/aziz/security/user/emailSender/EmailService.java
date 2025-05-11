package com.aziz.security.user.emailSender;

import com.aziz.security.user.dto.resetPass.Mail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class EmailService {

@Autowired
private  JavaMailSender javaMailSender;



    public  void sendEmail(Mail mail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("taissir.hammouda@outlook.com");
        message.setTo(mail.getTo());
        message.setSubject("Reset Password");
        message.setText("Your code is: "+mail.getCode());
        javaMailSender.send(message);
    }
}
