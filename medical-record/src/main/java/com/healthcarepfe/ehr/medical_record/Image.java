package com.healthcarepfe.ehr.medical_record;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
public class Image {
    public Image(byte[] image){
        this.image=image;
    }

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    Integer id;

    private byte[] image;

}
