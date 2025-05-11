package com.aziz.security.token;

import com.aziz.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;

    public void revokeUserToken(User user){
        tokenRepository.findAllValidTokenByUser(user.getId())
                .forEach(token -> token.setRevoked(true));
    }



    public boolean isTokenValid(String token){
        return tokenRepository.findByToken(token)
                .map(Token::isValid)
                .orElse(false);
    }
}
