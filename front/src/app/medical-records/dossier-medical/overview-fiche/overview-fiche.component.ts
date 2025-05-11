import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {RecordsService} from "../../service/records.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {initFlowbite} from "flowbite";
import {OrdonnanceResponse} from "../../models/OrdonnanceResponse";
import {ConsultationResponse} from "../../models/ConsultationResponse";

@Component({
  selector: 'app-overview-fiche',
  templateUrl: './overview-fiche.component.html',
  styleUrl: './overview-fiche.component.css'
})
export class OverviewFicheComponent implements OnInit{
  patientForm: FormGroup;
  sexeType: boolean = false;
  ageCalcule: number =0;
  age:boolean = false;
  permissions:string[]=[]
  user:any=[];
  image1:any;
  constructor(private tokenStorageService:TokenStorageService,private fb: FormBuilder,
              private recordsService: RecordsService,private route: Router,private toastr:ToastrService) {
    this.patientForm = this.fb.group({
      userId: [null],
      tailleCm: [null],
      age: [null],
      poidsKg: [null],
      groupeSanguin: [null],
      IMC: [""],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: [null, Validators.required],
      sexe: ['', Validators.required],
      lieuNaissance: ['', Validators.required],
      cin: [null, Validators.required],
      numTel: [null, Validators.required],
      adresse: ['', Validators.required],
      HTA: [false],
      diabete: [false],
      dyslipidemie: [false],
      autresAntecedentsFamiliaux: [''],
      nbGrossesse: [null],
      nbEnfantsVivants: [null],
      nbMacrosomies: [null],
      nbAvortements: [null],
      nbMortNes: [null],
      contraceptionUtilisee: [''],
      ageMenopause: [null],
      autresAntecedentsGynecoObstetriques: [''],
      alcoolSemaine: [null],
      tabacStatus: [null],
      nbCigaretteParJour: [null],
      exFumerDate: [null],
      drogue: [false],
      autreHabitudeToxique: ['']
    });
  }
  getFiche() {
    const formData = this.patientForm.value;
    let str = this.route.url
    let parts = str.split('/');

    // Get all parts after the fourth '/'
    let id = parts[4];
    //get the name from the route /home/medical-records/fiche-patient/14/Mohamed-Ben-Salah split the fname , last lname
    let fname = parts[5].split('-')[0];
    let lname = '';
    for (let i = 1; i < parts[5].split('-').length  ; i++) {
      lname = lname+ parts[5].split('-')[i] + ' ';
    }

    this.recordsService.getFichePatient(id).subscribe(
      response => {
console.log(response);

        const dateNaissance = response.dateNaissance;
        if (dateNaissance) {
          const dateNaissanceYear = new Date(dateNaissance).getFullYear();
          const currentYear = new Date().getFullYear();
          this.ageCalcule = currentYear - dateNaissanceYear;  // Update the property
          this.age = true;

        }
        this.patientForm.patchValue(response);
        if(!response.nom || !response.prenom) {
          this.patientForm.get('nom')?.setValue(lname);
          this.patientForm.get('prenom')?.setValue(fname);
        }
        this.getConsultations(response.userId)
        this.getOrdonnance(response.userId)
      },
      error => {
        console.log(error);
      })
    }
  ngOnInit(): void {
    // Fetch or set patient data
    this.getFiche();
    this.getImage();
    initFlowbite()

  }



  getImage(){

    let str = this.route.url
    let parts = str.split('/');


    // Get all parts after the fourth '/'
    let id = parts[4];



    this.recordsService.getImage(id).subscribe(
      (data: any) => {
        this.createImageFromBlob(data);
      },
      (error) => {
      },
      ()=>{
      }
    )

  }
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.image1 = reader.result as string;

    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  ordonnanceList:any[]=[];
consultationList:any[]=[];



getOrdonnance(id: any) {
  this.recordsService.getAllOrdonnancebyPatient(id).subscribe({
    next: (response: OrdonnanceResponse[]) => {
      // Filter out items with undefined or invalid dates and sort the response by date in descending order

      this.ordonnanceList=response.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()).slice(0, 3);

      // Take the last 3 ordonnances

    },
    error: (error: any) => {
    }
  });
}




  getConsultations(id: any) {
    this.recordsService.getAllConsult(id).subscribe(
      {
        next: (response: ConsultationResponse[]) => {
          // Sort the consultations by date in descending order
          this.consultationList = response.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()).slice(0, 3);
        },
        error: (error: any) => {
        }
      }
    );
  }
  DetailleConsultation(patientid:any,id: any) {
    this.route.navigate(['home/medical-records/consultation-page/'+patientid+'/'+id]);
  }


}
