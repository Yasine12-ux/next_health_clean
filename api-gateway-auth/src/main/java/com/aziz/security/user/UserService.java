package com.aziz.security.user;

import com.aziz.security.custom_annotations.method_annotations.LogMethodTime;
import com.aziz.security.notification.NotificationService;
import com.aziz.security.permission.StructureRelationType;
import com.aziz.security.role.Role;
import com.aziz.security.role.RoleRepository;
import com.aziz.security.role.RoleService;
import com.aziz.security.structures.StructureMiniDto;
import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.line.LineRepository;
import com.aziz.security.structures.line.LineService;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.plant.PlantRepository;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.product_section.ProductSectionRepository;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.structures.segment.SegmentRepository;
import com.aziz.security.structures.segment.SegmentService;
import com.aziz.security.token.TokenService;
import com.aziz.security.user.dto.ChangePasswordRequest;
import com.aziz.security.user.dto.FullCreateUserDto;
import com.aziz.security.user.dto.FullUserDto;
import com.aziz.security.user.dto.UserDTO;
import com.aziz.security.user.dto.resetPass.CheckCodeDTO;
import com.aziz.security.user.dto.resetPass.Mail;
import com.aziz.security.user.dto.resetPass.ResetChangePassword;
import com.aziz.security.user.dto.resetPass.ResetPasswordDTO;
import com.aziz.security.user.emailSender.EmailService;
import com.aziz.security.user.emailSender.VerificationCode;
import com.aziz.security.user.emailSender.VerificationCodeRepository;
import com.aziz.security.user.emailSender.VerificationCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final VerificationCodeService verificationCodeService;
    private final EmailService emailService;
    private final PlantRepository plantRepository;
    private final ProductSectionRepository productSectionRepository;
    private final SegmentRepository segmentRepository;
    private final SegmentService segmentService;
    private final LineRepository lineRepository;
    private final LineService lineService;
    private final RoleService roleService;
    private final UserImageRepository userImageRepository;
    private NotificationService notificationService;
    @LogMethodTime
    public ResponseEntity<?> modifyUser(FullUserDto userDTO){

        var user = repository.findById(userDTO.userInfo().id())
                .orElseThrow();

        if(!user.getRole().getName().equals(userDTO.userInfo().role())){
            var role = roleRepository.findRoleByName(userDTO.userInfo().role()).orElseThrow();
            user.setRole(role);
        }

        try {
            fillUserStructureForModifyUser(new FullCreateUserDto(null, userDTO.plantsManagingIds(), userDTO.productSectionsManagingIds(), userDTO.segmentsManagingIds(), userDTO.resourceHumanSegmentsIds(), userDTO.plantDoctorId(), userDTO.plantNurseId(), userDTO.linesManagingIds(), userDTO.lineWorkingId()),
                    Optional.of(user.getRole()), user);
        }catch (StructureContainsManagerException e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if(!user.getEmail().equals(userDTO.userInfo().email())){
            Optional<User> userEmail = repository.findByEmail(userDTO.userInfo().email());
            if(userEmail.isPresent()){
                return new ResponseEntity<>("email:"+userDTO.userInfo().email()+" is used by other user", HttpStatus.NOT_MODIFIED);
            }
            user.setEmail(userDTO.userInfo().email());
            tokenService.revokeUserToken(user);
        }


        user.setEnable(userDTO.userInfo().isEnable());
        user.setFirstname(userDTO.userInfo().firstname());
        user.setLastname(userDTO.userInfo().lastname());
        user.setPhone(userDTO.userInfo().phone());
        repository.save(user);
        return new ResponseEntity<>(UserDTO.convertToUserDto(user),HttpStatus.OK);

    }

    @LogMethodTime
    public ResponseEntity<?> modifyUserStatus(Integer id, Boolean isEnable){
        var user = repository.findById(id)
                .orElseThrow();
        user.setEnable(isEnable);

        // when the state is false revoke all user tokens, so he can't lo gin again
        if(!isEnable) tokenService.revokeUserToken(user);

        repository.save(user);
        return new ResponseEntity<>(user.isEnabled(),HttpStatus.OK);
    }
    @LogMethodTime
    public FullUserDto getUser(Integer id) {
        var user = repository.findById(id)
                .orElseThrow();

        return FullUserDto.convertToFullUserDto(user);
    }
    @LogMethodTime
    public List<UserDTO> getAllUsers(String mail) {
        return repository.findAll()
                .stream()
                .filter(user -> !user.getEmail().equals(mail))
                .map(UserDTO::convertToUserDto)
                .collect(Collectors.toList());
    }
    public void changePassword(ChangePasswordRequest request) {

        var user =  repository.findByEmail(request.getEmail())
                .orElseThrow();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }


//    public ResponseEntity<?> deleteUser(Integer id) {
//        var user = repository.findById(id);
//        if(user.isPresent()){
//            repository.deleteById(id);
//        }
//        return new ResponseEntity<>(HttpStatus.OK);
//
//    }

    public ResponseEntity<?> modifyUserArchiveStatus(Integer id,Boolean archive){
        var user = repository.findById(id)
                .orElseThrow();
        user.setArchived(archive);
        user.setEnable(!archive);

        // when the state is false revoke all user tokens, so he can't lo gin again
        if(archive) tokenService.revokeUserToken(user);

        repository.save(user);
        return new ResponseEntity<>(user.isEnabled(),HttpStatus.OK);

    }

    public ResponseEntity<?>createUser(FullCreateUserDto fullCreateUserDto){
        var testUser =repository.findUserByEmailOrPhone(fullCreateUserDto.userInfo().email(),fullCreateUserDto.userInfo().phone());
        if(testUser.isPresent()){
            return new ResponseEntity<>("Phone or Email is used",HttpStatus.BAD_REQUEST);
        };

        try {
            User user = toUser(fullCreateUserDto);
            repository.save(user);
            return new ResponseEntity<>(UserDTO.convertToUserDto(user),HttpStatus.CREATED);
        }
        catch (StructureContainsManagerException e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    public User toUser(FullCreateUserDto fullCreateUserDto) throws Exception {
        var role = roleRepository.findRoleByName(fullCreateUserDto.userInfo().role());
        if (role.isEmpty()) throw new Exception("Role not found");

        var user = User.builder()
                .firstname(fullCreateUserDto.userInfo().firstname())
                .lastname(fullCreateUserDto.userInfo().lastname())
                .email(fullCreateUserDto.userInfo().email())
                .phone(fullCreateUserDto.userInfo().phone())
                .password(passwordEncoder.encode(fullCreateUserDto.userInfo().password()))
                .role(role.get())
                .enable(true)
                .archived(false)
                .mfaEnabled(false)
                .build();

        fillUserStructureForCreateUser(fullCreateUserDto, role, user);

        repository.save(user);


        return user;
    }


    private void fillUserStructureForCreateUser(FullCreateUserDto fullCreateUserDto, Optional<Role> role, User user) throws StructureException {
        List<Plant> plants = null;
        List<ProductSection> productSections = null;
        List<Segment> managerSegments = null;
        List<Segment> rhSegments = null;
        Optional<Plant> docPlant = Optional.empty();
        Optional<Plant> nurPlant = Optional.empty();
        List<Line> lines = null;
        Optional<Line> lineWorker = Optional.empty();

        for (StructureRelationType structureRelationType : roleService.getRoleRequiredStructures(role.get())) {
            switch (structureRelationType) {
                case PLANT_MANAGER -> {
                    if (fullCreateUserDto.plantsManagingIds() == null) break;
                    if (fullCreateUserDto.plantsManagingIds().isEmpty()) break;

                    plants = fullCreateUserDto.plantsManagingIds().stream().map(id -> plantRepository.findPlantById(id).get()).collect(Collectors.toList());
                    if(plants.isEmpty()) throw new StructureLengthException("Select at least one plant");

                    for (Plant plant : plants) {
                        if (plant.getManager() != null) {
                            throw new StructureContainsManagerException("plant has manager");
                        }
                    }
                    break;
                }
                case PRODUCT_SECTION_MANAGER -> {
                    if (fullCreateUserDto.productSectionsManagingIds() == null) break;
                    if (fullCreateUserDto.productSectionsManagingIds().isEmpty()) break;

                    productSections = fullCreateUserDto.productSectionsManagingIds().stream().map(id -> productSectionRepository.findProductSectionById(id).get()).collect(Collectors.toList());
                    if(productSections.isEmpty()) throw new StructureLengthException("Select at least one product section");

                    for (ProductSection productSection : productSections) {
                        if (productSection.getManager() != null) {
                            throw new StructureContainsManagerException("ps has manager");
                        }
                    }
                    break;
                }
                case SEGMENT_MANAGER -> {
                    if (fullCreateUserDto.segmentsManagingIds() == null) break;
                    if (fullCreateUserDto.segmentsManagingIds().isEmpty()) break;

                    managerSegments = fullCreateUserDto.segmentsManagingIds().stream().map(id -> segmentRepository.findById(id).get()).collect(Collectors.toList());
                    if(managerSegments.isEmpty()) throw new StructureLengthException("Select at least one segment");

                    for (Segment segment : managerSegments) {
                        if (segment.getSegmentManager() != null)
                            throw new StructureContainsManagerException("segment has manager");
                    }
                    break;
                }
                case RH_SEGMENT -> {
                    if (fullCreateUserDto.resourceHumanSegmentsIds() == null) break;
                    if (fullCreateUserDto.resourceHumanSegmentsIds().isEmpty()) break;

                    rhSegments = fullCreateUserDto.resourceHumanSegmentsIds().stream().map(id -> segmentRepository.findById(id).get()).collect(Collectors.toList());
                    if(rhSegments.isEmpty()) throw new StructureLengthException("Select at least one segment");

                    for (Segment segment : rhSegments) {
                        if (segment.getHumanResources() != null) {
                            throw new StructureContainsManagerException("segment has rh");
                        }
                    }
                    break;
                }
                case DOCTOR -> {
                    if (fullCreateUserDto.plantDoctorId() == null) break;
                    docPlant =  plantRepository.findById(fullCreateUserDto.plantDoctorId());
                    if(docPlant.isEmpty()) throw new StructureLengthException("Select plant");
                    break;

                }
                case NURSE -> {
                    if (fullCreateUserDto.plantNurseId() == null) break;
                    nurPlant =  plantRepository.findById(fullCreateUserDto.plantNurseId());
                    if(nurPlant.isEmpty()) throw new StructureLengthException("Select plant");
                    break;
                }
                case LINE_MANAGER -> {
                    if (fullCreateUserDto.linesManagingIds() == null) break;
                    if (fullCreateUserDto.linesManagingIds().isEmpty()) break;

                    lines = fullCreateUserDto.linesManagingIds().stream().map(id -> lineRepository.findById(id).get()).collect(Collectors.toList());
                    if(lines.isEmpty()) throw new StructureLengthException("Select at least one line");


                    for (Line line : lines) {
                        if (line.getLineManager() != null)
                            throw new StructureContainsManagerException("Line has segment");
                    }
                }
                case WORKER -> {
                    if (fullCreateUserDto.lineWorkingId() == null) break;
                    lineWorker = lineRepository.findById(fullCreateUserDto.lineWorkingId());
                    if(lineWorker.isEmpty()) throw new StructureLengthException("Select line");

                }
            }
        }

        if (lines != null) {
            lines.forEach(line -> line.setLineManager(user));
            user.setLineManaging(lines);
        }
        if (nurPlant.isPresent()) {
            nurPlant.get().getNurses().add(user);
            user.setPlantNurse(nurPlant.get());
        }
        if (docPlant.isPresent()) {
            docPlant.get().getDoctors().add(user);
            user.setPlantDoctor(docPlant.get());
        }
        if (rhSegments != null) {
            rhSegments.forEach(segment -> segment.setHumanResources(user));
            user.setResourceHumanSegment(rhSegments);
        }
        if (managerSegments != null) {
            managerSegments.forEach(segment -> segment.setSegmentManager(user));
            user.setSegmentManaging(managerSegments);
        }
        if (productSections != null) {
            productSections.forEach(productSection -> productSection.setManager(user));
            user.setProductSectionManaging(productSections);
        }
        if (plants != null) {
            plants.forEach(plant -> plant.setManager(user));
            user.setPlantManaging(plants);
        }

        if (lineWorker.isPresent()) {
            if (lineWorker.get().getWorkers() != null)
                lineWorker.get().getWorkers().add(user);
            else
                lineWorker.get().setWorkers(List.of(user));

            user.setLineWorking(lineWorker.get());
        }
    }
    private void fillUserStructureForModifyUser(FullCreateUserDto fullCreateUserDto, Optional<Role> role, User user) throws StructureException {
        List<Plant> plants = null;
        List<ProductSection> productSections = null;
        List<Segment> managerSegments = null;
        List<Segment> rhSegments = null;
        Optional<Plant> docPlant = Optional.empty();
        Optional<Plant> nurPlant = Optional.empty();
        List<Line> lines = null;
        Optional<Line> lineWorker = Optional.empty();

        var roleReqStructures=roleService.getRoleRequiredStructures(role.get());

            for (StructureRelationType structureRelationType : roleService.getRoleRequiredStructures(role.get())) {
                if(!roleReqStructures.contains(structureRelationType)) continue;

                switch (structureRelationType) {
                case PLANT_MANAGER -> {
                    if (fullCreateUserDto.plantsManagingIds() == null) break;
                    if (fullCreateUserDto.plantsManagingIds().isEmpty()) break;

                    plants = fullCreateUserDto.plantsManagingIds().stream().map(id -> plantRepository.findPlantById(id).get()).collect(Collectors.toList());
                    if(plants.isEmpty()) throw new StructureLengthException("Select at least one plant");

                    for (Plant plant : plants) {
                        if (plant.getManager() != null &&(!plant.getManager().equals(user)) ) {
                            throw new StructureContainsManagerException("plant has manager");
                        }
                    }
                    break;
                }
                case PRODUCT_SECTION_MANAGER -> {
                    if (fullCreateUserDto.productSectionsManagingIds() == null) break;
                    if (fullCreateUserDto.productSectionsManagingIds().isEmpty()) break;

                    productSections = fullCreateUserDto.productSectionsManagingIds().stream().map(id -> productSectionRepository.findProductSectionById(id).get()).collect(Collectors.toList());
                    if(productSections.isEmpty()) throw new StructureLengthException("Select at least one product section");

                    for (ProductSection productSection : productSections) {
                        if (productSection.getManager() != null &&(!productSection.getManager().equals(user))) {
                            throw new StructureContainsManagerException("ps has manager");
                        }
                    }
                    break;
                }
                case SEGMENT_MANAGER -> {
                    if (fullCreateUserDto.segmentsManagingIds() == null) break;
                    if (fullCreateUserDto.segmentsManagingIds().isEmpty()) break;

                    managerSegments = fullCreateUserDto.segmentsManagingIds().stream().map(id -> segmentRepository.findById(id).get()).collect(Collectors.toList());
                    if(managerSegments.isEmpty()) throw new StructureLengthException("Select at least one segment");

                    for (Segment segment : managerSegments) {
                        if (segment.getSegmentManager() != null && (!segment.getSegmentManager().equals(user)))
                            throw new StructureContainsManagerException("segment has manager");
                    }
                    break;
                }
                case RH_SEGMENT -> {
                    if (fullCreateUserDto.resourceHumanSegmentsIds() == null) break;
                    if (fullCreateUserDto.resourceHumanSegmentsIds().isEmpty()) break;

                    rhSegments = fullCreateUserDto.resourceHumanSegmentsIds().stream().map(id -> segmentRepository.findById(id).get()).collect(Collectors.toList());
                    if(rhSegments.isEmpty()) throw new StructureLengthException("Select at least one segment");

                    for (Segment segment : rhSegments) {
                        if (segment.getHumanResources() != null && (!segment.getHumanResources().equals(user))) {
                            throw new StructureContainsManagerException("segment has rh");
                        }
                    }
                    break;
                }
                    case DOCTOR -> {
                        if (fullCreateUserDto.plantDoctorId() == null) break;
                        docPlant =  plantRepository.findById(fullCreateUserDto.plantDoctorId());
                        if(docPlant.isEmpty()) throw new StructureLengthException("Select plant");
                        break;

                    }
                    case NURSE -> {
                        if (fullCreateUserDto.plantNurseId() == null) break;
                        nurPlant =  plantRepository.findById(fullCreateUserDto.plantNurseId());
                        if(nurPlant.isEmpty()) throw new StructureLengthException("Select plant");
                        break;
                    }
                case LINE_MANAGER -> {
                    if (fullCreateUserDto.linesManagingIds() == null) break;
                    if (fullCreateUserDto.linesManagingIds().isEmpty()) break;

                    lines = fullCreateUserDto.linesManagingIds().stream().map(id -> lineRepository.findById(id).get()).collect(Collectors.toList());
                    if(lines.isEmpty()) throw new StructureLengthException("Select at least one line");
                    for (Line line : lines) {
                        if (line.getLineManager() != null && (!line.getLineManager().equals(user)))
                            throw new StructureContainsManagerException("Line has segment");
                    }
                }
                case WORKER -> {
                    if (fullCreateUserDto.lineWorkingId() == null) break;
                    lineWorker = lineRepository.findById(fullCreateUserDto.lineWorkingId());
                    if(lineWorker.isEmpty()) throw new StructureLengthException("Select line");
                }
            }
        }

//        user.setPlantManaging(List.of());
//        user.setProductSectionManaging(List.of());
//        user.setSegmentManaging(List.of());
//        user.setLineManaging(List.of());
//
//        user.setSegmentDoctors(List.of());
//        user.setSegmentNurse(List.of());
//        user.setResourceHumanSegment(List.of());
//        user.setLineWorking(null);

        if (lines != null) {
            lines.forEach(line -> line.setLineManager(user));
            user.setLineManaging(lines);
        }else if(user.getLineManaging()!=null){
            user.getLineManaging().forEach(line -> line.setLineManager(null));
            user.setLineManaging(null);

        }


        if (nurPlant.isPresent()) {
            nurPlant.get().getNurses().add(user);
            user.setPlantNurse(nurPlant.get());
        } else if (user.getPlantNurse()!=null) {
            user.setPlantNurse(null);
        }
        if (docPlant.isPresent()) {
            docPlant.get().getDoctors().add(user);
            user.setPlantDoctor(docPlant.get());
        } else if (user.getPlantDoctor()!=null) {
            user.setPlantDoctor(null);

        }
        if (rhSegments != null) {
            rhSegments.forEach(segment -> segment.setHumanResources(user));
            user.setResourceHumanSegment(rhSegments);
        } else if (user.getResourceHumanSegment()!=null) {
            user.getResourceHumanSegment().forEach(segment -> segment.setHumanResources(null));
            user.setResourceHumanSegment(null);
        }
        if (managerSegments != null) {
            managerSegments.forEach(segment -> segment.setSegmentManager(user));
            user.setSegmentManaging(managerSegments);
        } else if (user.getSegmentManaging()!=null) {
            user.getSegmentManaging().forEach(segment -> segment.setSegmentManager(null));
            user.setSegmentManaging(null);
        }
        if (productSections != null) {
            productSections.forEach(productSection -> productSection.setManager(user));
            user.setProductSectionManaging(productSections);
        } else if (user.getProductSectionManaging()!=null) {
            user.getProductSectionManaging().forEach(productSection -> productSection.setManager(null));
            user.setProductSectionManaging(null);
        }
        if (plants != null) {
            plants.forEach(plant -> plant.setManager(user));
            user.setPlantManaging(plants);
        } else if (user.getPlantManaging()!=null) {
            user.getPlantManaging().forEach(plant -> plant.setManager(null));
            user.setPlantManaging(null);
        }

        if (lineWorker.isPresent()) {
            if (lineWorker.get().getWorkers() != null)
                lineWorker.get().getWorkers().add(user);
            else
                lineWorker.get().setWorkers(List.of(user));
            user.setLineWorking(lineWorker.get());
        } else if (user.getLineWorking()!=null) {
            user.getLineWorking().getWorkers().remove(user);
            user.setLineWorking(null);

        }

        lineWorker.ifPresent(lineRepository::save);
    }


    public ResponseEntity<?> emailExist(ResetPasswordDTO resetPasswordDTO) {
        var user = repository.findByEmail(resetPasswordDTO.getEmail());
        if(user.isPresent()){



            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    public ResponseEntity<?> sendEmailExist(ResetPasswordDTO resetPasswordDTO) {
        var user = repository.findByEmail(resetPasswordDTO.getEmail());
        String code = UserResetPassCode.getCode();


        Mail mail = new Mail(resetPasswordDTO.getEmail(), code);

        emailService.sendEmail(mail);
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(resetPasswordDTO.getEmail());
        verificationCode.setCode(code);
        verificationCode.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        verificationCodeRepository.save(verificationCode);
        return new ResponseEntity<>(HttpStatus.OK);


    }

    public ResponseEntity<?> ResetChangePass(ResetChangePassword resetChangePassword) {
        var user = repository.findByEmail(resetChangePassword.getEmail());
        if(user.isPresent()){
            if (this.verificationCodeService.isCodeValid(new CheckCodeDTO(resetChangePassword.getEmail(), resetChangePassword.getCode())).getStatusCode().isError()) {
                throw new IllegalStateException("Code is not valid");
            }
            var user1 = user.get();
            if (!resetChangePassword.getNewPassword().equals(resetChangePassword.getConfirmationPassword())) {
                throw new IllegalStateException("Password are not the same");
            }
            user1.setPassword(passwordEncoder.encode(resetChangePassword.getNewPassword()));
            repository.save(user1);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }




//    public UserDTO findUserByEmail(String email){
//        return repository.findByEmail(email).stream().map(UserDTO::convertToUserDto).findFirst().orElse(null);
//    }





//    public ResponseEntity<?> createManyUsers(List<FullCreateUserDto> fullCreateUserDtoList){
//        if(fullCreateUserDtoList.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        if(fullCreateUserDtoList.size()==1) return createUser(fullCreateUserDtoList.get(0));
//        // at least two rows
//        ArrayList<UserDTO> response = new ArrayList<>();
//
//        for(FullCreateUserDto fullCreateUserDto:fullCreateUserDtoList){
//            if(!repository.findByEmail(fullCreateUserDto.userInfo().email()).isEmpty()) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//            try {
//                User user = toUserCreate(fullCreateUserDto);
//                repository.save(user);
//                response.add(UserDTO.convertToUserDto(user));
//            }catch (Exception e){
//                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//            }
//        }
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }


    public ResponseEntity<?> uploadImage(MultipartFile file, String email) throws IOException {
    var user = repository.findByEmail(email);
    if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    var user1 = user.get();
    var image= new UserImage(Base64.getEncoder().encodeToString(file.getBytes()).getBytes());
    user1.setUserImage(image);
    userImageRepository.save(image);
    repository.save(user1);
    return new ResponseEntity<>(HttpStatus.OK);
    }
    public byte[] getImage(String email){
        var user = repository.findByEmail(email);
        if(user.isEmpty()) return null;
        if(user.get().getUserImage()==null) return null;
        return Base64.getDecoder().decode(user.get().getUserImage().getImage());
    }
    public ResponseEntity<?> changeImage(MultipartFile file, String email) throws IOException {
        var user = repository.findByEmail(email);
        if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        var user1 = user.get();
        var image= new UserImage(Base64.getEncoder().encodeToString(file.getBytes()).getBytes());
        user1.setUserImage(image);
        userImageRepository.save(image);
        repository.save(user1);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    public ResponseEntity<?> uploadImagebyID(MultipartFile file, Integer id) throws IOException {
        var user = repository.findById(id);
        if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        var user1 = user.get();
        var image= new UserImage(Base64.getEncoder().encodeToString(file.getBytes()).getBytes());
        user1.setUserImage(image);
        userImageRepository.save(image);
        repository.save(user1);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public byte[] getImageByID(Integer id){
        var user = repository.findById(id);
        if(user.isEmpty()) return null;
        if(user.get().getUserImage()==null) return null;
        return Base64.getDecoder().decode(user.get().getUserImage().getImage());
    }
    public ResponseEntity<?> changeImageById(MultipartFile file,Integer id) throws IOException {
        var user = repository.findById(id);
        if(user.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        var user1 = user.get();
        var image= new UserImage(Base64.getEncoder().encodeToString(file.getBytes()).getBytes());
        user1.setUserImage(image);
        userImageRepository.save(image);
        repository.save(user1);
        return new ResponseEntity<>(HttpStatus.OK);
    }




    public ResponseEntity<?> getAllSegmentsForRH(String email) {
        var rh = repository.findByEmail(email);
        if(rh.isEmpty()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        if(rh.get().getResourceHumanSegment().isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(rh.get().getResourceHumanSegment().stream().map(StructureMiniDto::toStructureMiniDto).collect(Collectors.toList()), HttpStatus.OK);

    }


    /**
     * # all structure exceptions must inherent from this class
     */
    static class StructureException extends Exception{
        public StructureException(String message){
            super(message);
        }
    }    /**
     * # throw this Exception when the structure(plant,ps, ...) already have manager
     */

    static class StructureContainsManagerException extends StructureException{
        public StructureContainsManagerException(String message){
            super(message);
        }
    }

    /**
     * # throw this Exception when the number of structure(plant,ps, ...) less than the required length
     */
    static class StructureLengthException extends StructureException{
        public StructureLengthException(String message){
            super(message);
        }
    }

//findLineManagingIdById








}
