package com.aziz.security.attachement;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttachmentService {
    private final AttachementRepository repository;

    public ResponseEntity<?> uploadAttachments(MultipartFile file) throws IOException {
        var attachment = new Attachment();
        attachment.setContentType(file.getContentType());
        attachment.setName(file.getOriginalFilename());
        attachment.setAttachment(file.getBytes());
        repository.save(attachment);
        return new ResponseEntity<>(HttpStatus.OK);
    }




    public Optional<Attachment> getAttachments(Integer id){
        return repository.findById(id);
    }


//    public ResponseEntity<?> changeImage(MultipartFile file) throws IOException {
//        if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        var user1 = user.get();
//        var image= new UserImage(Base64.getEncoder().encodeToString(file.getBytes()).getBytes());
//        user1.setUserImage(image);
//        userImageRepository.save(image);
//        repository.save(user1);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
}
