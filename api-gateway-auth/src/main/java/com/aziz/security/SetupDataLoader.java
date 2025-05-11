package com.aziz.security;

import com.aziz.security.auth.AuthenticationService;
import com.aziz.security.permission.AllPermissionService;
import com.aziz.security.permission.Permission;
import com.aziz.security.permission.PermissionRepository;
import com.aziz.security.permission.StructureRelationType;
import com.aziz.security.role.Role;
import com.aziz.security.role.RoleRepository;
import com.aziz.security.structures.line.Line;
import com.aziz.security.structures.line.LineRepository;
import com.aziz.security.structures.plant.Plant;
import com.aziz.security.structures.plant.PlantRepository;
import com.aziz.security.structures.product_section.ProductSection;
import com.aziz.security.structures.product_section.ProductSectionRepository;
import com.aziz.security.structures.segment.Segment;
import com.aziz.security.structures.segment.SegmentRepository;
import com.aziz.security.user.UserRepository;
import com.aziz.security.user.UserService;
import com.aziz.security.user.dto.FullCreateUserDto;
import com.aziz.security.user.dto.RegisterUserInfoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserService userService;
    @Autowired

    private PlantRepository plantRepository;
    @Autowired
    private ProductSectionRepository productSectionRepository;
    @Autowired
    private SegmentRepository segmentRepository;
    @Autowired
    private LineRepository lineRepository;
    
    @Autowired
    private AllPermissionService allPermissionService;

    private final Set<String> generatedNumbers = new HashSet<>();
    private final Random random = new Random();
    // generation of random users
    public String generateUniqueTunisianPhoneNumber(Set<String> existingNumbers) {
        String phoneNumber;

        do {
            // Possible first digits
            int[] firstDigits = {2, 5, 7, 9};

            // Select a random first digit from the possible choices
            int firstDigit = firstDigits[this.random.nextInt(firstDigits.length)];

            // Generate the remaining seven digits
            StringBuilder phoneNumberBuilder = new StringBuilder();
            phoneNumberBuilder.append(firstDigit);
            for (int i = 0; i < 7; i++) {
                phoneNumberBuilder.append(this.random.nextInt(10));
            }

            phoneNumber = phoneNumberBuilder.toString();
        } while (existingNumbers.contains(phoneNumber));

        // Add the new unique number to the set of existing numbers
        existingNumbers.add(phoneNumber);

        return phoneNumber;
    }


    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup)
            return;


        // Roles
        Role adminRole = createRoleIfNotFound("Admin","Responsable de la gestion des rôles,structures et de l'enregistrement des utilisateurs.",Set.of(allPermissionService.getCREATE_ROLE_PERMISSION(),allPermissionService.getREGISTER_USER_PERMISSION(),allPermissionService.getSTRUCTURE_PERMISSION()));

        Role rhRole = createRoleIfNotFound("Ressource Humain","Gestion des rendez-vous et du tableau de bord des ressources humaines.",Set.of(allPermissionService.getRDV_RH_PERMISSION(),allPermissionService.getRH_DASHBOARD()));

        Role doctor = createRoleIfNotFound("Médicine","Accès aux rendez-vous médicaux, dossiers médicaux et tableau de bord des médecins.",Set.of(allPermissionService.getRDV_DOCTOR_PERMISSION(),allPermissionService.getDOSSIER_MEDICAL_PERMISSION(),allPermissionService.getDoctor_DASHBOARD()));
        Role nurse = createRoleIfNotFound("Infirmière","Gestion des rendez-vous infirmiers, verrouillage horaire et tableau de bord des infirmières.",Set.of(allPermissionService.getRDV_NURSE_PERMISSION(),allPermissionService.getRDV_BLOCK_OUT_PERMISSION(),allPermissionService.getNURSE_DASHBOARD(),allPermissionService.getFICHE_PATIENT_PERMISSION()));

        Role worker = createRoleIfNotFound("Employé","Employé.",Set.of(allPermissionService.getWORKER_PERMISSION()));
        Role plantManager = createRoleIfNotFound("Plant Manager","Consulter la tableau de bord de plant.",Set.of(allPermissionService.getDASHBOARD_PLANT_MANAGER_PERMISSION()));
        Role lineManager = createRoleIfNotFound("Contremaître","Consulter list de rdv et le tableau de bord de ligne.",Set.of(allPermissionService.getRDV_LINE_MANAGER_PERMISSION(),allPermissionService.getLine_Manager_DASHBOARD()));
        Role psManager = createRoleIfNotFound("PS manager","Consulter la tableau de bord de product section.",Set.of(allPermissionService.getPS_MANAGER_PERMISSION()));
        Role segmentManager = createRoleIfNotFound("Chef segment","Consulter list de rdv et le tableau de bord de segment.",Set.of(allPermissionService.getRDV_SEGMENT_MANAGER_PERMISSION()));

//        List<Plant> plantsVar = new ArrayList<>();
//        List<ProductSection> productSectionsVar = new ArrayList<>();
//        List<Segment> segmentsVar = new ArrayList<>();
//        List<Line> linesVar = new ArrayList<>();
//
//        String[] plants= {"Sousse","Tunis","Sfax","Monastir","Béja","Mahdia","Kairouan"};
//        int [] plantsNbPs = {7,5,6,11,3,4,5};
//
//        for (int i = 0; i < plants.length; i++) {
//            Plant plant = createPlantIfNotFound(plants[i]);
//            plantsVar.add(plant);
//            for (int j = 0; j < plantsNbPs[i]; j++) {
//                ProductSection productSection = createProductSectionIfNotFound(plant, "Product Section " + (j + 1));
//                productSectionsVar.add(productSection);
//                for (int k = 0; k < 3; k++) {
//                    Segment segment = createSegmentIfNotFound(productSection, "Segment " + (k + 1));
//                    segmentsVar.add(segment);
//                    for (int l = 0; l < 4; l++) {
//                        Line line = createLineIfNotFound(segment, "Line " + (l + 1));
//                        linesVar.add(line);
//                    }
//                }
//            }
//        }
//

        // create super admin if not exist

        createUserIfNotFound("Admin","Admin","admin@gmail.com","99999999","admin","Admin");
//
//        // Users
//        var admin = FullCreateUserDto.builder()
//                .userInfo(new RegisterUserInfoDto(
//                        "Aziz","Hlila","hlilaaziz@gmail.com","27561272","aziz","Admin"))
//                .build();
//        try{
//            this.generatedNumbers.add("27561272");
//            var x=userService.toUser(admin);
//            userRepository.save(x);
//            System.out.println(admin);
//        }catch (Exception e){}
//
//        var admin2 = FullCreateUserDto.builder()
//                .userInfo(new RegisterUserInfoDto(
//                        "Taissir","Hammouda","taissir7ammouda@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),"taissir","Admin"))
//                .build();
//        try{
//            var x=userService.toUser(admin2);
//            userRepository.save(x);
//            System.out.println(admin2);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        // infermier
//        String[] infermiersFirstName= {"Salim","Chadi"};
//        String[] infermiersLastName= {"Boussaid","Kammoun"};
//
//        for(int i=0;i<infermiersFirstName.length;i++){
//            var infermiere2 = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            infermiersFirstName[i],infermiersLastName[i],infermiersFirstName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),infermiersFirstName[i],"Infirmière"))
//                    .build();
//            try{
//                var x=userService.toUser(infermiere2);
//                userRepository.save(x);
//
//                x.setPlantNurse(plantsVar.get(i));
//                plantsVar.get(i).setNurses(new ArrayList<>(List.of(x)));
//                plantRepository.save(plantsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//        // doctor
//        String[] doctorsFirstName= {"Iheb","Aljia"};
//        String[] doctorsLastName= {"Inoubli","Bouzidi"};
//        for (int i=0;i<doctorsFirstName.length;i++){
//            var doctor2 = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            doctorsFirstName[i],doctorsLastName[i],doctorsFirstName[i]+doctorsLastName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),doctorsFirstName[i],"Médicine"))
//                    .build();
//            try{
//                var x=userService.toUser(doctor2);
//                userRepository.save(x);
//
//                x.setPlantDoctor(plantsVar.get(i));
//                plantsVar.get(i).setDoctors(new ArrayList<>(List.of(x)));
//                plantRepository.save(plantsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//
//        // RH
//        String[] rhFirstName= {"Nassim","Aziz"};
//        String[] rhLastName= {"F.H","Bannour"};
//
//        for(int i=0;i<rhFirstName.length;i++){
//            var rh = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            rhFirstName[i],rhLastName[i],rhFirstName[i]+rhLastName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),rhFirstName[i],"Ressource Humain"))
//                    .build();
//            try{
//                var x=userService.toUser(rh);
//                userRepository.save(x);
//
//                x.setResourceHumanSegment(List.of(segmentsVar.get(i)));
//                segmentsVar.get(i).setHumanResources(x);
//                segmentRepository.save(segmentsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//
//        // line manager
//        String[] lineManagerFirstName= {"Amir","Aziz"};
//        String[] lineManagerLastName= {"Prince","Brahem"};
//
//        for(int i=0;i<lineManagerFirstName.length;i++){
//            var lineMg = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            lineManagerFirstName[i],lineManagerLastName[i],lineManagerFirstName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),lineManagerFirstName[i],"Contremaître"))
//                    .build();
//            try{
//                var x=userService.toUser(lineMg);
//                userRepository.save(x);
//
//                x.setLineManaging(new ArrayList<>(List.of(linesVar.get(i))));
//                linesVar.get(i).setLineManager(x);
//                lineRepository.save(linesVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//
//        // segment manager
//        String[] segmentManagerFirstName= {"Amine","Laith"};
//        String[] segmentManagerLastName= {"Jguirim","Ferjoui"};
//
//        for(int i=0;i<segmentManagerFirstName.length;i++){
//            var segmentMg = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            segmentManagerFirstName[i],segmentManagerLastName[i],segmentManagerFirstName[i]+segmentManagerLastName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),segmentManagerFirstName[i],"Chef segment"))
//                    .build();
//            try{
//                var x=userService.toUser(segmentMg);
//                userRepository.save(x);
//
//                x.setSegmentManaging(new ArrayList<>(List.of(segmentsVar.get(i))));
//                segmentsVar.get(i).setSegmentManager(x);
//                segmentRepository.save(segmentsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//
//        // plant manager
//        // 7 plant managers
//        String[] plantManagerFirstName= {"Ahmed","Baha","Chadi","Dhia","Emir","Firas","Ghazi"};
//        String[] plantManagerLastName= {"Boukadida","Messadi","Kammoun","Boussaid","Kammoun","Boussaid","Kammoun"};
//
//        for(int i=0;i<plantManagerFirstName.length;i++){
//            var plantMg = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            plantManagerFirstName[i],plantManagerLastName[i],plantManagerFirstName[i]+plantManagerLastName[i]+"@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),plantManagerFirstName[i],"Plant Manager"))
//                    .build();postgres@localhost [2]
//            try{
//                var x=userService.toUser(plantMg);
//                userRepository.save(x);
//
//                x.setPlantManaging(new ArrayList<>(List.of(plantsVar.get(i))));
//                plantsVar.get(i).setManager(x);
//                plantRepository.save(plantsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//        // product section managers
//        // 36 product section managers with defferent names
//        String[] psManagerFirstName = {
//                "Ahmed", "Mohamed", "Fatma", "Amina", "Karim", "Hedi", "Nadia", "Ali", "Sami", "Khaled",
//                "Imen", "Rania", "Yassine", "Anis", "Salma", "Faten", "Hichem", "Mouna", "Lotfi", "Lamia",
//                "Zied", "Mehdi", "Ines", "Sonia", "Hana", "Omar", "Samir", "Latifa", "Mourad", "Amira",
//                "Tarek", "Saida", "Mazen", "Marwa", "Nizar", "Souad"
//        };
//
//        String[] psManagerLastName = {
//                "Ben Ali", "Trabelsi", "Bouazizi", "Chahed", "Ghannouchi", "Chebbi", "Jomaa", "Haddad", "Mansouri", "Bouhlel",
//                "Bousnina", "Ben Salah", "Ferjani", "El Aouini", "Mahmoudi", "Zouari", "Baccouche", "Chouchane", "Mahjoub", "Cherif",
//                "Khelifi", "Slimane", "Hamdi", "Bouaziz", "Boughzala", "Karray", "Gharbi", "Dridi", "Grira", "Ammar",
//                "Ayari", "Ben Youssef", "Hamrouni", "Abid", "Nefzi", "Rekik"
//        };
//
//        for(int i=0;i<psManagerFirstName.length;i++){
//            var psMg = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            psManagerFirstName[i],psManagerLastName[i],psManagerFirstName[i]+psManagerLastName[i]+"1@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),psManagerFirstName[i],"PS manager"))
//                    .build();
//            try{
//                var x=userService.toUser(psMg);
//                userRepository.save(x);
//
//                x.setProductSectionManaging(new ArrayList<>(List.of(productSectionsVar.get(i))));
//                productSectionsVar.get(i).setManager(x);
//                productSectionRepository.save(productSectionsVar.get(i));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//
//
//        // 84 workers
//        String[] workerFirstName = {
//                "Ali", "Mohamed", "Houssem", "Badr", "Amine", "Khalil", "Mehdi", "Sami",
//                "Ahmed", "Ibrahim", "Youssef", "Walid", "Nizar", "Hatem",
//                "Salem", "Anis", "Firas", "Oussama", "Hedi", "Hamza", "Aymen",
//                "Kais", "Mahdi", "Tarek", "Omar", "Lotfi", "Nabil", "Moncef",
//                "Marouane", "Mourad", "Sofiane", "Foued", "Jamel", "Karim",
//                "Adel", "Zied", "Hamed", "Ridha", "Skander", "Chokri", "Hafedh",
//                "Nidhal", "Bilel", "Riadh", "Majdi", "Malek", "Mouez", "Khaled",
//                "Mounir", "Fares", "Moez", "Wissem", "Zouhair", "Othman",
//                "Fadhel", "Ayoub", "Ala", "Saif", "Wael", "Issam", "Maher",
//                "Raouf", "Chaker", "Basem", "Saber", "Tahar", "Hatem", "Wael",
//                "Fethi", "Hichem", "Rafik", "Med Ali", "Monder", "Ridha",
//                "Bechir", "Borhen", "Nadhem", "Taoufik", "Montassar", "Atef",
//                "Slim", "Hamed", "Noureddine", "Amir", "Moez", "Abdelhakim"
//        };
//
//        String[] workerLastName = {
//                "Hsouna", "Ben Salah", "Ben Ali", "Ben Amor", "Ben Jemaa", "Slam",
//                "Klila", "Boussaid", "Kammoun", "Trabelsi", "Bouhlel", "Bouaziz",
//                "Mabrouk", "Kouki", "Jaziri", "Chaouch", "Souissi", "Hamrouni",
//                "Ferjani", "Hannachi", "Karray", "Chouchane", "Masri", "Dridi",
//                "Zouaoui", "Aouini", "Amri", "Masmoudi", "Baccar", "Gharbi",
//                "Zribi", "Bouchnak", "Haddad", "Gharsallah", "Guedri", "Cherif",
//                "Ammar", "Zidi", "Karoui", "Jouini", "Nefzi", "Saad", "Bouzid",
//                "Dahmani", "Elloumi", "Beji", "Mouelhi", "Khelifi", "Jemni",
//                "Turki", "Jebali", "Dali", "Khadhar", "Yousfi", "Abbes", "Neji",
//                "Chaabane", "Ben Hassine", "Boujelben", "Saidi", "Ghouma",
//                "Slimane", "Ben Hmida", "Mouhli", "Cherif", "Romdhane", "Khemiri",
//                "Jendoubi", "Kooli", "Mhirsi", "Belhadj", "Mellouli", "Bendahmane",
//                "Ajimi", "Mejri", "Rahmouni", "Laroussi", "Bouhlel", "Chatti",
//                "Zoghlami", "Nasri", "Kallel", "Bouzgarrou", "Bennour", "Jrad",
//                "Nouira", "Ghariani", "Ayari"
//        };
//
//        for(int i=0;i<workerFirstName.length;i++){
//            var worker2 = FullCreateUserDto.builder()
//                    .userInfo(new RegisterUserInfoDto(
//                            workerFirstName[i],workerLastName[i],workerFirstName[i]+workerLastName[i]+"3@gmail.com",this.generateUniqueTunisianPhoneNumber(generatedNumbers),workerFirstName[i],"Employé"))
//                    .build();
//            try{
//                var x=userService.toUser(worker2);
//                userRepository.save(x);
//
//                x.setLineWorking(linesVar.get(i*4));
//                linesVar.get(i*4 ).setWorkers(new ArrayList<>(List.of(x)));
//                lineRepository.save(linesVar.get(i*4));
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//        }
//

        alreadySetup = true;

    }
    @Transactional
    Permission createPermissionIfNotFound(String name, String desc, StructureRelationType permissionStructure) {
        Optional<Permission> permission= permissionRepository.findByName(name);
        if(permission.isPresent())
            return permission.get();

        Permission newPermission= new Permission(name,desc);
        newPermission.setRequiredStructure(permissionStructure);
        permissionRepository.save(newPermission);
        return newPermission;

    }
    @Transactional
    Plant createPlantIfNotFound(String name) {
        Optional<Plant> Plant= plantRepository.findPlantByName(name);
        if(Plant.isPresent())
            return Plant.get();

        Plant plant= new Plant(name);
        plantRepository.save(plant);
        return plant;
    }
    @Transactional
    ProductSection createProductSectionIfNotFound(Plant plant, String name) {
        Optional<ProductSection> ProductSection= productSectionRepository.findProductSectionByNameAndPlantId(name,plant.getId());
        if(ProductSection.isPresent())
            return ProductSection.get();

        ProductSection productSection= new ProductSection(name,plant);
        productSectionRepository.save(productSection);
        return productSection;
    }
    @Transactional
    Segment createSegmentIfNotFound(ProductSection productSection, String name) {
        Optional<Segment> Segment2= segmentRepository.findSegmentByNameAndProductSectionId(name,productSection.getId());
        if(Segment2.isPresent())
            return Segment2.get();

        Segment segment= Segment.builder().name(name).productSection(productSection).build();
        segmentRepository.save(segment);
        return segment;
    }
    @Transactional
    Line createLineIfNotFound(Segment segment, String name) {
        Optional<Line> Line2= lineRepository.findLineByNameAndSegmentId(name,segment.getId());
        if(Line2.isPresent())
            return Line2.get();

        Line line= Line.builder().name(name).segment(segment).build();
        lineRepository.save(line);
        return line;
    }
    @Transactional
    Role createRoleIfNotFound(
            String name,String description, Set<Permission> permissions) {

        var roleOptional = roleRepository.findRoleByName(name);
        if (roleOptional.isEmpty()){
            var role = Role.builder()
                    .permissions(permissions)
                    .name(name)
                    .description(description)
                    .build();

            roleRepository.save(role);
            return role;
        }
        return roleOptional.get();
    }

    // create user if not exist
    @Transactional
    void createUserIfNotFound(String firstName, String lastName, String email, String phone,String password, String role) {
        var user = userRepository.findByEmail(email);
        System.out.println(user);
        if (user.isEmpty()) {
            var newUser = FullCreateUserDto.builder()
                    .userInfo(new RegisterUserInfoDto(
                            firstName,lastName,email,phone,password,role))
                    .build();
            try{
                var x=userService.toUser(newUser);
                userRepository.save(x);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}