package com.aziz.security.user.emailSender;

import com.aziz.security.user.dto.resetPass.CheckCodeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VerificationCodeService {

    @Autowired
    private  VerificationCodeRepository verificationCodeRepository;
    public ResponseEntity<?> isCodeValid(CheckCodeDTO checkCodeDTO) {
        var mail = verificationCodeRepository.findByEmail(checkCodeDTO.getEmail());


        if (mail.isPresent()) {
            VerificationCode verificationCode = mail.get();

            if (verificationCode.getCode().equals(checkCodeDTO.getCode()) && !verificationCode.isExpired()) {
                return ResponseEntity.ok().build();
            }
        }

        return  ResponseEntity.badRequest().build();
    }

    @Scheduled(fixedDelay = 10000)
    public void deleteExpiredCodes() {
        verificationCodeRepository.deleteExpiredCodes();
    }
}