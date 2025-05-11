package com.aziz.security.auth;

import com.aziz.security.token.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service;
private final TokenService tokenService;

  @Operation(summary = "✅ : login")
  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }

  @Operation(summary = "✅ : get refresh token")
  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }

  @PostMapping("/verify")
  public ResponseEntity<?> verifyCode(
          @RequestBody VerificationRequest verificationRequest
  ){
    return ResponseEntity.ok(service.verifyCode(verificationRequest));
  }

    @PostMapping("/check-token/{token}")
    public ResponseEntity<?> checkToken(
            @PathVariable String token
    ){
        return ResponseEntity.ok(tokenService.isTokenValid(token));
    }


}
