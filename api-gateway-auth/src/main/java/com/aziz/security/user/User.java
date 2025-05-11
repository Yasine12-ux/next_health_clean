package com.aziz.security.user;

import com.aziz.security.role.Role;
import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.token.Token;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.List;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails,Comparable<User> {

  @Id
  @GeneratedValue
  private Integer id;
  private String firstname;
  private String lastname;
  @Column(unique = true)
  private String email;
  private String password;
  private Boolean enable;
  
  private Boolean archived;

  private boolean mfaEnabled;
  private String secrete;
@Column(unique = true)
  private String phone;

  @OneToOne(fetch = FetchType.LAZY)
  private UserImage userImage;

  // Relationships

  @ManyToOne(fetch = FetchType.LAZY)
  private Line lineWorking;

  @OneToMany(mappedBy = "lineManager", fetch = FetchType.LAZY)
  private List<Line> lineManaging;

  @OneToMany(mappedBy = "segmentManager", fetch = FetchType.LAZY)
  private List<Segment> segmentManaging;

  @OneToMany(mappedBy = "humanResources", fetch = FetchType.LAZY)
  private List<Segment> resourceHumanSegment;

  @ManyToOne(fetch = FetchType.LAZY)
  private Plant plantDoctor;

  @ManyToOne(fetch = FetchType.LAZY)
  private Plant plantNurse;

  @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
  private List<ProductSection> productSectionManaging;

  @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
  private List<Plant> plantManaging;

  @ManyToOne
  private Role role;

  @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE, orphanRemoval = true)
  private List<Token> tokens;









  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
      return role.getAuthorities();
  }

  @Override
  public String getPassword() {
    return password;
  }


  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return enable;
  }

  @Override
  public String toString() {
    return "User{" +
            "id=" + id +
            ", email='" + email + '\'' +
            '}';

  }
    @Override
  public int compareTo(User user) {
    return getId().compareTo(user.getId());

  }
}
