package com.aziz.security.permission;

import com.aziz.security.user.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
@Getter
@RequiredArgsConstructor
public class AllPermissionService {

    public PermissionRepository permissionRepository;
    // Permissions
    private final  Permission CREATE_ROLE_PERMISSION;
    private final  Permission REGISTER_USER_PERMISSION ;
    private final  Permission STRUCTURE_PERMISSION;
    private final  Permission RDV_RH_PERMISSION;
    private final  Permission RDV_NURSE_PERMISSION;
    private final  Permission RDV_DOCTOR_PERMISSION;
    private final Permission NURSE_DASHBOARD;
    private final Permission FICHE_PATIENT_PERMISSION;

    private final Permission DOSSIER_MEDICAL_PERMISSION;

    private final  Permission RDV_BLOCK_OUT_PERMISSION;

    private final  Permission DASHBOARD_PLANT_MANAGER_PERMISSION;
    private final  Permission WORKER_PERMISSION;
    private final  Permission RDV_LINE_MANAGER_PERMISSION;
    private final  Permission PS_MANAGER_PERMISSION;
    private final  Permission RDV_SEGMENT_MANAGER_PERMISSION;
    private final Permission Line_Manager_DASHBOARD;
    private final Permission Segment_Manager_DASHBOARD;
    private final Permission Doctor_DASHBOARD;
    private final Permission RH_DASHBOARD;

    @Autowired
    public AllPermissionService(PermissionRepository permissionRepository){
        this.permissionRepository= permissionRepository;
        // ADMIN
        CREATE_ROLE_PERMISSION = createPermissionIfNotFound("ROLE_MANAGEMENT","Créer, Modifier et Supprimer des Rôles",null);
        REGISTER_USER_PERMISSION = createPermissionIfNotFound("USER_MANAGEMENT","Créer, Modifier, Activer, Désactiver et Archiver des Utilisateurs",null) ;
        STRUCTURE_PERMISSION = createPermissionIfNotFound("STRUCTURE_MANAGEMENT","Créer, Modifier et Supprimer des Structures",null) ;

        // RDV
        RDV_RH_PERMISSION = createPermissionIfNotFound("RH_APPOINTMENT","Créer ou Annuler des Rendez-vous", StructureRelationType.RH_SEGMENT);
        RDV_LINE_MANAGER_PERMISSION = createPermissionIfNotFound("LINE_MANAGER_APPOINTMENT","Consulter liste des Rendez-vous de ligne", StructureRelationType.LINE_MANAGER) ;
        RDV_SEGMENT_MANAGER_PERMISSION = createPermissionIfNotFound("SEGMENT_MANAGER_APPOINTMENT","Consulter liste des Rendez-vous de segment", StructureRelationType.SEGMENT_MANAGER) ;
        RDV_NURSE_PERMISSION = createPermissionIfNotFound("NURSE_APPOINTMENT","Créer, Annuler des Rendez-vous", StructureRelationType.NURSE);
        RDV_DOCTOR_PERMISSION = createPermissionIfNotFound("DOCTOR_APPOINTMENT","Compléter des Rendez-vous", StructureRelationType.DOCTOR);

        FICHE_PATIENT_PERMISSION = createPermissionIfNotFound("PATIENT_RECORD","Gérer les Fiches Patients", StructureRelationType.NURSE) ;

        DOSSIER_MEDICAL_PERMISSION = createPermissionIfNotFound("DOSSIER_MEDICAL","Consulter liste des Rendez-vous", StructureRelationType.DOCTOR) ;

        NURSE_DASHBOARD = createPermissionIfNotFound("NURSE_DASHBOARD","Consulter le Tableau de Bord des infirmière", StructureRelationType.NURSE);

        RDV_BLOCK_OUT_PERMISSION = createPermissionIfNotFound("BLOCK_OUT_APPOINTMENT","Créer, Supprimer des intervalle verrouillage horaires", StructureRelationType.NURSE);

        WORKER_PERMISSION = createPermissionIfNotFound("WORKER","Employé", StructureRelationType.WORKER) ;

        DASHBOARD_PLANT_MANAGER_PERMISSION = createPermissionIfNotFound("PLANT_MANAGER_DASHBOARD","consulter Tableau du board plant manager", StructureRelationType.PLANT_MANAGER) ;
        PS_MANAGER_PERMISSION = createPermissionIfNotFound("PS_MANAGER_DASHBOARD","consulter Tableau du board ps manager", StructureRelationType.PRODUCT_SECTION_MANAGER) ;
        Line_Manager_DASHBOARD = createPermissionIfNotFound("LINE_MANAGER_DASHBOARD","consulter Tableau du board contermaître", StructureRelationType.LINE_MANAGER) ;
        Segment_Manager_DASHBOARD = createPermissionIfNotFound("SEGMENT_MANAGER_DASHBOARD","Consulter le Tableau de Bord du Chef de Segment", StructureRelationType.SEGMENT_MANAGER) ;
        Doctor_DASHBOARD = createPermissionIfNotFound("DOCTOR_DASHBOARD","Consulter le Tableau de Bord du Médecin", StructureRelationType.DOCTOR) ;
        RH_DASHBOARD = createPermissionIfNotFound("RH_DASHBOARD","Consulter le Tableau de Bord du RH segment ", StructureRelationType.RH_SEGMENT) ;
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

    public Boolean userHasPermission(User user,Permission permission){
        return user.getRole().getPermissions().stream().toList().contains(permission);
    }
    public Boolean userHasAllPermission(User user, Set<Permission> permissions){
        return user.getRole().getPermissions().stream().toList().containsAll(permissions);
    }

    public Boolean userHasAnyPermission(User user, Set<Permission> permissions){
        for (Permission permission : permissions) {
            if(userHasPermission(user,permission))
                return true;
        }
        return false;
    }

}
