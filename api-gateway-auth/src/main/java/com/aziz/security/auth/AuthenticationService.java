package com.aziz.security.auth;

import com.aziz.security.config.JwtService;
import com.aziz.security.role.RoleRepository;
import com.aziz.security.tfa.TwoFactorAuthenticationService;
import com.aziz.security.token.Token;
import com.aziz.security.token.TokenRepository;
import com.aziz.security.token.TokenType;
import com.aziz.security.user.User;
import com.aziz.security.user.UserRepository;
import com.aziz.security.user.dto.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final TwoFactorAuthenticationService tfaService;

  public UserDTO register(RegisterRequest request) {
    var role = roleRepository.findRoleByName(request.getRole()).orElseThrow();

    var user = User.builder()
        .firstname(request.getFirstname())
        .lastname(request.getLastname())
        .email(request.getEmail())
        .phone(request.getPhone())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(role)
        .enable(true)
        .archived(false)
        .mfaEnabled(false)
        .build();
    userRepository.save(user);
    return UserDTO.convertToUserDto(user);
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );
    var user = userRepository.findByEmail(request.getEmail())
        .orElseThrow();
    if(user.isMfaEnabled()){
      return AuthenticationResponse.builder()
              .accessToken("")
              .refreshToken("")
              .build();
    }

    // if user disable he can't log in
    if (!user.isEnabled()) return new AuthenticationResponse();

    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserTokenAccess(user, jwtToken);
    saveUserTokenRefresh(user,refreshToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
        .refreshToken(refreshToken)
        .build();
  }

  private void saveUserTokenAccess(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .expired(false)
        .revoked(false)
            .tokenType(TokenType.ACCESS_TOKEN)
        .build();
    tokenRepository.save(token);
  }
  private void saveUserTokenRefresh(User user, String jwtToken) {
    var token = Token.builder()
            .user(user)
            .token(jwtToken)
            .expired(false)
            .revoked(false)
            .tokenType(TokenType.REFRESH_TOKEN)
            .build();
    tokenRepository.save(token);
  }
  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String email;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    email = jwtService.extractUsername(refreshToken);
    if (email != null) {
      var user = this.userRepository.findByEmail(email)
              .orElseThrow();
      if(!user.isEnabled()) return;
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserTokenAccess(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }

  public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
    User user = userRepository
            .findByEmail(verificationRequest.getEmail())
            .orElseThrow(()->new EntityNotFoundException(
                    String.format("No user found with %S",verificationRequest.getCode()))
            );
    if(tfaService.isOptNotValid(user.getSecrete(), verificationRequest.getCode())){
      throw new BadCredentialsException("Code is not correct");
    }
    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .build();

  }
}
