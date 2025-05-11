package com.healthcarepfe.ehr;

import com.healthcarepfe.ehr.medical_record.MedicalRecord;
import com.healthcarepfe.ehr.medical_record.details.*;
import com.healthcarepfe.ehr.medical_record.repositories.ConsultationRepository;
import com.healthcarepfe.ehr.medical_record.repositories.DossierMedicalRepository;
import com.healthcarepfe.ehr.medical_record.repositories.ExamenRepository;
import com.healthcarepfe.ehr.medical_record.repositories.OrdonnanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.time.LocalDateTime;
import java.util.ArrayList;


@EnableFeignClients
@SpringBootApplication
@RequiredArgsConstructor
@EnableDiscoveryClient
public class EhrApplication implements CommandLineRunner {
	private final DossierMedicalRepository dossierMedicalRepository;
	private final ConsultationRepository consultationRepository;
	private final OrdonnanceRepository ordonnanceRepository;
	private final ExamenRepository examenRepository;
	public static void main(String[] args) {
		SpringApplication.run(EhrApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// make fiche patient and consultation and ordonnance and courrier and examen for list of patients
		// worker
//		String[] patientFirstName= {"Ali", "Mohamed", "Houssem", "Badr", "Amine", "Khalil", "Mehdi", "Sami",
//				"Ahmed", "Ibrahim", "Youssef", "Walid", "Nizar", "Hatem",
//				"Salem", "Anis", "Firas", "Oussama", "Hedi", "Hamza", "Aymen",
//				"Kais", "Mahdi", "Tarek", "Omar", "Lotfi", "Nabil", "Moncef",
//				"Marouane", "Mourad", "Sofiane", "Foued", "Jamel", "Karim",
//				"Adel", "Zied", "Hamed", "Ridha", "Skander", "Chokri", "Hafedh",
//				"Nidhal", "Bilel", "Riadh", "Majdi", "Malek", "Mouez", "Khaled",
//				"Mounir", "Fares", "Moez", "Wissem", "Zouhair", "Othman",
//				"Fadhel", "Ayoub", "Ala", "Saif", "Wael", "Issam", "Maher",
//				"Raouf", "Chaker", "Basem", "Saber", "Tahar", "Hatem", "Wael",
//				"Fethi", "Hichem", "Rafik", "Med Ali", "Monder", "Ridha",
//				"Bechir", "Borhen", "Nadhem", "Taoufik", "Montassar", "Atef",
//				"Slim", "Hamed", "Noureddine", "Amir", "Moez", "Abdelhakim"};
//		String[] patientLastName= {"Hsouna", "Ben Salah", "Ben Ali", "Ben Amor", "Ben Jemaa", "Slam",
//				"Klila", "Boussaid", "Kammoun", "Trabelsi", "Bouhlel", "Bouaziz",
//				"Mabrouk", "Kouki", "Jaziri", "Chaouch", "Souissi", "Hamrouni",
//				"Ferjani", "Hannachi", "Karray", "Chouchane", "Masri", "Dridi",
//				"Zouaoui", "Aouini", "Amri", "Masmoudi", "Baccar", "Gharbi",
//				"Zribi", "Bouchnak", "Haddad", "Gharsallah", "Guedri", "Cherif",
//				"Ammar", "Zidi", "Karoui", "Jouini", "Nefzi", "Saad", "Bouzid",
//				"Dahmani", "Elloumi", "Beji", "Mouelhi", "Khelifi", "Jemni",
//				"Turki", "Jebali", "Dali", "Khadhar", "Yousfi", "Abbes", "Neji",
//				"Chaabane", "Ben Hassine", "Boujelben", "Saidi", "Ghouma",
//				"Slimane", "Ben Hmida", "Mouhli", "Cherif", "Romdhane", "Khemiri",
//				"Jendoubi", "Kooli", "Mhirsi", "Belhadj", "Mellouli", "Bendahmane",
//				"Ajimi", "Mejri", "Rahmouni", "Laroussi", "Bouhlel", "Chatti",
//				"Zoghlami", "Nasri", "Kallel", "Bouzgarrou", "Bennour", "Jrad",
//				"Nouira", "Ghariani", "Ayari"};
//
//		ArrayList<MedicalRecord> medicalRecordList = new ArrayList<>();
//		for (int i = 0; i < patientFirstName.length; i++) {
//			medicalRecordList.add(dossierMedicalRepository.save(MedicalRecord.builder()
//					.userId(i + 56)
//					.tailleCm(0)
//					.poidsKg(0)
//					.ficheAdministrative(FicheAdministrative.builder()
//							.nom(patientFirstName[i])
//							.prenom(patientLastName[i])
//							.build())
//					.antecedentsFamiliaux(new AntecedentsFamiliaux())
//					.antecedentsGynecoObstetriques(new AntecedentsGynecoObstetriques())
//					.habitudesToxiques(new HabitudesToxiques(
//							0,
//							new Tabac(),
//							false,
//							""
//					))
//					.consultations(new ArrayList<>())
//					.vaccinations(new ArrayList<>())
//					.build()));
//		}
//
//
//
//		String ordannanceCatergory[] = {"Medicament 1", "Medicament 2", "Medicament 3"};
//		String examenType[] = {"Examen biologique", "Examen radiologique", "Examen cardiaque"};
//		// fake 6 consultation with ordonnance for each patient
//		for (int i = 0; i < medicalRecordList.size(); i++) {
//			for (int j = 0; j < 6; j++) {
//				Consultation consultation = Consultation.builder()
//						.date(LocalDateTime.now())
//						.motif("Motif de consultation")
//						.poidsKg(70)
//						.tailleCm(170)
//						.pouls(80)
//						.tensionArterielle(120)
//						.diagnostic("Diagnostic")
//						.complete(!(j % 10 == 0))
//						.build();
//				Ordonnance ordonnance = Ordonnance.builder()
//						.date(LocalDateTime.now())
//						.catergorie(ordannanceCatergory[j % 3])
//						.description("Description")
//						.build();
//				consultation.setOrdonnance(ordonnance);
//				consultation.setMedicalRecord(medicalRecordList.get(i));
//				consultation.setExamen(new ArrayList<>());
//				//fake examen for each consultation
//				Examen examen = Examen.builder()
//						.date(LocalDateTime.now())
//						.resultat( Math.random() > 0.3 ? "Resultat" :null)
//						.consultation(consultation)
//						.type(examenType[Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : 2])
//						.build();
//				consultation.getExamen().add(examen);
//				ordonnanceRepository.save(ordonnance);
//				consultationRepository.save(consultation);
//				examenRepository.save(examen);
//			}
//		}






	}
}
