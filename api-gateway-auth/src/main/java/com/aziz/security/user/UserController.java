package com.aziz.security.user;

import com.aziz.security.auth.AuthenticationService;
import com.aziz.security.config.JwtService;
import com.aziz.security.custom_annotations.method_annotations.LogMethodTime;
import com.aziz.security.user.dto.ChangePasswordRequest;
import com.aziz.security.user.dto.FullCreateUserDto;
import com.aziz.security.user.dto.FullUserDto;
import com.aziz.security.user.dto.UserDTO;
import com.aziz.security.user.dto.resetPass.CheckCodeDTO;
import com.aziz.security.user.dto.resetPass.ResetChangePassword;
import com.aziz.security.user.dto.resetPass.ResetPasswordDTO;
import com.aziz.security.user.emailSender.EmailService;
import com.aziz.security.user.emailSender.VerificationCodeService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final VerificationCodeService verificationCodeService;
    private final UserService service;
    private final AuthenticationService authenticationService;
    private final EmailService emailService;
    private final JwtService jwtService;
//    @Operation(summary = "✅ : create user")
//    @PostMapping("/register")
//    //@PreAuthorize("hasAuthority('Utilisateurs')")
//    public ResponseEntity<?> register(
//            @RequestBody RegisterRequest request
//    ) {
//        var response = authenticationService.register(request);
//        return new ResponseEntity<>(response,HttpStatus.CREATED);
//    }




    @Operation(summary = "✅ : create user")
    @PostMapping("/user")
    @PreAuthorize("hasAuthority('USER_MANAGEMENT')")
    public ResponseEntity<?> createUser(
            @RequestBody FullCreateUserDto fullCreateUserDto
    ) {
        return service.createUser(fullCreateUserDto);
    }
    @Operation(summary = "✅:Modify user info ")
    @PutMapping("/user")
    @PreAuthorize("hasAuthority('USER_MANAGEMENT')")
    public ResponseEntity<?> modifyUser(
            @RequestBody FullUserDto userDTO
    ){
        return service.modifyUser(userDTO);
    }
    @Operation(summary = "✅:Modify user status(enable/disable) by id ")
    @PatchMapping("/user/{id}/{isEnable}")
    @PreAuthorize("hasAuthority('USER_MANAGEMENT')")
    public ResponseEntity<?> modifyUserStatus(
            @PathVariable Integer id,
            @PathVariable Boolean isEnable
    ){
        return service.modifyUserStatus(id,isEnable);
    }

    @Operation(summary = "✅:Modify user status(archived/unarchived) by id ")
    @PatchMapping("/user/archived/{id}/{isArchived}")
    public ResponseEntity<?> modifyUserArchivedStatus(
            @PathVariable Integer id,
            @PathVariable Boolean isArchived
    ){
        return service.modifyUserArchiveStatus(id,isArchived);
    }


    @Operation(summary = "✅:get user info ")
    @GetMapping("/user/{id}")
    @PreAuthorize("hasAuthority('USER_MANAGEMENT')")
    public FullUserDto getUser(
            @PathVariable Integer id
    ){
        return service.getUser(id);
    }
    @Operation(summary = "✅:get all users ")
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('USER_MANAGEMENT')")
    public List<UserDTO> getAllUsers(HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return null;
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return service.getAllUsers(email);
    }

//    @DeleteMapping("/user/{id}")
//    public ResponseEntity<?> deleteUser(
//            @PathVariable Integer id
//    ){
//        return service.deleteUser(id);
//    }


    @Operation(summary = "✅:change password ")
    @PostMapping("/changePassword")

    public ResponseEntity<?> changePassword(
          @RequestBody ChangePasswordRequest request
    ) {
        service.changePassword(request);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/resourse")
    public String test(){
        return "welcom";
    }

    @Operation(summary = "✅:check by email ")
    @PostMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(
            @RequestBody ResetPasswordDTO resetPasswordDTO
    ){
        return service.emailExist(resetPasswordDTO);
    }

    @Operation(summary = "✅:reset password by email ")
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordDTO resetPasswordDTO
    ){
        return service.sendEmailExist(resetPasswordDTO);
    }

    @Operation(summary = "✅:check code")
    @PostMapping("/checkCode")
    public ResponseEntity<?> checkCode(
            @RequestBody CheckCodeDTO checkCodeDTO
    ){
        return  verificationCodeService.isCodeValid(checkCodeDTO);
    }
    @Operation(summary = "✅:change reset password")
    @PostMapping("/changeResetPassword")
    public ResponseEntity<?> changeResetPassword(
            @RequestBody ResetChangePassword resetChangePassword
    ){
        return service.ResetChangePass(resetChangePassword);
    }

//    @Operation(summary = "✅:get user by email")
//    @GetMapping("/user/email/{email}")
//    public UserDTO getUserByEmail(
//            @PathVariable String email
//    ){
//        return service.findUserByEmail(email);
//    }


//create many users
//
//    @Operation(summary = "✅:create many users")
//    @PostMapping("/many-users")
//    public ResponseEntity<?> createManyUsers(
//            @RequestBody List<FullCreateUserDto> fullCreateUserDtos
//    ){
//        return service.createManyUsers(fullCreateUserDtos);
//    }



    @Operation(summary = "✅:upload image of user")
    @PostMapping("/upload-image/{email}")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile file,
            @PathVariable String email
    ) throws IOException {
        return service.uploadImage(file,email);

    }

    @Operation(summary = "✅:change image of user")
    @PutMapping("/change-image/{email}")
    public ResponseEntity<?> changeImage(
            @RequestParam("image") MultipartFile file,
            @PathVariable String email
    ) throws IOException {
        return service.changeImage(file,email);
    }

    @Operation(summary = "✅:get image of user")
    @GetMapping("/get-image/{email}")
    public ResponseEntity<?> getImage(
            @PathVariable String email
    ) {
        byte[] imageData = this.service.getImage(email);
        if (imageData != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } else {
            return new ResponseEntity<>("no image",HttpStatus.BAD_REQUEST) ;
        }
    }
    @Operation(summary = "✅:upload image of user")
    @PostMapping("/upload-imageId/{id}")
    public ResponseEntity<?> uploadImageById(
            @RequestParam("image") MultipartFile file,
            @PathVariable Integer id
    ) throws IOException {
        return service.uploadImagebyID(file,id);

    }

    @Operation(summary = "✅:change image of user")
    @PutMapping("/change-imageid/{id}")
    public ResponseEntity<?> ChangeImageByid(
            @RequestParam("image") MultipartFile file,
            @PathVariable Integer id
    ) throws IOException {
        return service.changeImageById(file,id);
    }

    @Operation(summary = "✅:get image of user")
    @GetMapping("/get-imageId/{id}")
    public ResponseEntity<?> getImageByid(
            @PathVariable Integer id
    ) {
        byte[] imageData = this.service.getImageByID(id);
        if (imageData != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } else {
            return new ResponseEntity<>("no image",HttpStatus.BAD_REQUEST) ;
        }
    }

    @GetMapping("/rh-segments")
    public ResponseEntity<?> getAppointmentsByRhSegment(
            HttpServletRequest request){
        if(request.getHeader("Authorization")==null) return new ResponseEntity<>("No token found",HttpStatus.FORBIDDEN);
        var email= jwtService.extractUsername(request.getHeader("Authorization").substring(7));
        return service.getAllSegmentsForRH(email);
    }


}
