package com.aziz.security.token;

import com.aziz.security.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Token {

  @Id
  @GeneratedValue
    public Integer id;

  @Column(unique = true,length = 1000)
  public String token;

  public boolean revoked;

  public boolean expired;
  public TokenType tokenType;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  public User user;

    public boolean isValid() {
        return !revoked && !expired;
    }
}
