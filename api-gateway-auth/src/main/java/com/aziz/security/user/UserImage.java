package com.aziz.security.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Data
@RequiredArgsConstructor
public class UserImage {
    public UserImage(byte[] image){
        this.image=image;
    }

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    Integer id;

    @OneToOne(mappedBy = "userImage")
    User user;

    private byte[] image;

}
