package com.aziz.security.attachement;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
public class AttachmentController {
private final AttachmentService service;
    @Operation(summary = "✅: Upload attachments")
    @PostMapping("/upload-attachments")
    public ResponseEntity<?> uploadAttachments(
            @RequestParam("attachments") MultipartFile file
    ) throws IOException {
        return service.uploadAttachments(file);
    }



    @GetMapping("/get-attachments/{id}")
    public ResponseEntity<byte[]> getAttachments(@PathVariable Integer id) {
        Optional<Attachment> attachmentData = this.service.getAttachments(id);
        if (attachmentData.isPresent()) {
            Attachment attachment = attachmentData.get();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + attachment.getName());
            headers.setContentType(MediaType.parseMediaType(attachment.getContentType()));

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(attachment.getAttachment());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
