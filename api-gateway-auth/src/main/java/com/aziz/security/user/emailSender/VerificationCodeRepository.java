package com.aziz.security.user.emailSender;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode,String> {

    Optional<VerificationCode> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM VerificationCode vc WHERE vc.expiryTime <= CURRENT_TIMESTAMP")
    void deleteExpiredCodes();
}
