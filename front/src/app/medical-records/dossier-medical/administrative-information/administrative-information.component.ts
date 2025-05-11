import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecordsService} from "../../service/records.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../services/users.service";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {initFlowbite} from "flowbite";
import {changeFumerStaus, changeGroupS, FichePatientResponse} from "../../models/FichePatientResponse";

@Component({
  selector: 'app-fiche-patient',
  templateUrl: './administrative-information.component.html',
  styleUrls: ['./administrative-information.component.css']
})
export class AdministrativeInformationComponent implements OnInit{
  fullForm: FormGroup;
  showGynecoObstetriques: boolean = false;
  ageCalcule: string ="0";
  age:boolean = false;
  permissions:string[]=[]
  user:any=[];
  image1:any;
  errorMessage: string = '';


  groupeSanguinOptions= [
 'A_POSITIF',
   'A_NEGATIF',
  'B_POSITIF',
   'B_NEGATIF',
  'AB_POSITIF',
  'AB_NEGATIF',
   'O_POSITIF',
  'O_NEGATIF'
]


  tabacStatusOptions = [
 'FUMEUR',
   'NON_FUMEUR',
'EX_FUMEUR']

  constructor( private tokenStorageService:TokenStorageService,private fb: FormBuilder,private recordsService: RecordsService,private route: Router,private toastr:ToastrService) {


    this.fullForm = this.fb.group({
      userId: [null],
      IMC:[{ value: null, disabled: true }],
      poidsKg:[0],
      tailleCm:[0],
      groupeSanguin: [''],
      nom: [null,Validators.required],
      prenom: [null,Validators.required],
      dateNaissance: [null,Validators.required ],
      age: [{ value: null, disabled: true }],
      sexe: [null,Validators.required],
      lieuNaissance: [null,Validators.required],
      cin: [null, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numTel: [null, [Validators.required, ]],
      adresse: [null,Validators.required],
      HTA: [false],
      diabete: [false],
      dyslipidemie: [false],
      autresAntecedentsFamiliaux: [null],
      nbGrossesse: [null],
      nbEnfantsVivants: [null],
      nbMacrosomies: [null],
      nbAvortements: [null],
      nbMortNes: [null],
      contraceptionUtilisee: [null],
      ageMenopause: [null],
      autresAntecedentsGynecoObstetriques: [null],
      alcoolSemaine: [null],
      tabacStatus: [''],
      nbCigaretteParJour: [null],
      exFumerDate: [null],
      drogue: [false],
      autreHabitudeToxique: [null]
    });
  }

  getFiche() {
    const formData = this.fullForm.value;
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
          console.log(response)
          const dateNaissance = response.dateNaissance;
          if (dateNaissance) {
            const dateNaissanceYear = new Date(dateNaissance).getFullYear();
            const currentYear = new Date().getFullYear();
              // this.ageCalcule = response.age+" ans";  // Update the property
            // console.log(this.ageCalcule)
            this.age = true;

          }
          this.fullForm.patchValue(response);
          if(!response.nom || !response.prenom) {
            this.fullForm.get('nom')?.setValue(lname);
            this.fullForm.get('prenom')?.setValue(fname);
          }
          this.fullForm.get('age')?.setValue(this.fullForm.get('age')?.value+" ans")
        },
        error => {
          console.log(error);
        })





}

  toFichePatientResponse(form: any): FichePatientResponse {
    return {
      userId: form.userId,
      tailleCm: form.tailleCm,
      poidsKg: form.poidsKg,
      groupeSanguin: form.groupeSanguin,
      age:form.age,
      IMC: form.IMC,
      nom: form.nom,
      prenom: form.prenom,
      dateNaissance: form.dateNaissance,
      sexe: form.sexe,
      lieuNaissance: form.lieuNaissance,
      cin: form.cin,
      numTel: form.numTel,
      adresse: form.adresse,
      HTA: form.HTA,
      diabete: form.diabete,
      dyslipidemie: form.dyslipidemie,
      autresAntecedentsFamiliaux: form.autresAntecedentsFamiliaux,
      nbGrossesse: form.nbGrossesse,
      nbEnfantsVivants: form.nbEnfantsVivants,
      nbMacrosomies: form.nbMacrosomies,
      nbAvortements: form.nbAvortements,
      nbMortNes: form.nbMortNes,
      contraceptionUtilisee: form.contraceptionUtilisee,
      ageMenopause: form.ageMenopause,
      autresAntecedentsGynecoObstetriques: form.autresAntecedentsGynecoObstetriques,
      alcoolSemaine: form.alcoolSemaine,
      tabacStatus: form.tabacStatus,
      nbCigaretteParJour: form.nbCigaretteParJour,
      exFumerDate: form.exFumerDate,
      drogue: form.drogue,
      autreHabitudeToxique: form.autreHabitudeToxique
    };
  }

onSubmit() {
      const formData = this.fullForm.value;
  if (this.fullForm.get('nom')?.value === null || this.fullForm.get('prenom')?.value === null) {
    this.toastr.error('Veuillez saisir le nom et le prénom du patient');
    return;
  }

  // check date of birth
  const today = new Date();
   if (this.fullForm!.get('dateNaissance') != null && this.fullForm.get('dateNaissance')?.value < today) {
    this.toastr.error('Veuillez saisir une date de naissance valide');
    return;
   }

  if (this.fullForm.get('dateNaissance')?.value === null) {
    this.toastr.error('Veuillez saisir la date de naissance du patient');
    return;
  }
  const dateNaissanceValue = this.fullForm.get('dateNaissance')?.value;
  const dateNaissance = new Date(dateNaissanceValue);

  const currentDate = new Date();

  if (dateNaissance > currentDate) {
    this.toastr.error('Veuillez saisir une date de naissance valide');
    return;
  }
  if (this.fullForm.get('sexe')?.value === null) {
    this.toastr.error('Veuillez choisir le sexe du patient');
    return;
  }
  if (this.fullForm.get('lieuNaissance')?.value === null) {
    this.toastr.error('Veuillez saisir le lieu de naissance du patient');
    return;
  }

  if (this.fullForm.get('numTel')?.value === null) {
    this.toastr.error('Veuillez saisir le numéro de téléphone du patient');
    return;
  }

  //check tel number
if (this.fullForm.get('numTel')?.value!== null)
{
  if ((this.fullForm.get('numTel')?.value).toString().length !== 8) {
    this.toastr.error('Veuillez saisir un numéro de téléphone valide de 8 chiffres');
    return;
  }
  //check start of number tel
  if ((this.fullForm.get('numTel')?.value).toString().charAt(0) !== '2'  && (this.fullForm.get('numTel')?.value).toString().charAt(0) !== '4' && (this.fullForm.get('numTel')?.value).toString().charAt(0) !== '5' && (this.fullForm.get('numTel')?.value).toString().charAt(0) !== '7' && (this.fullForm.get('numTel')?.value).toString().charAt(0) !== '9'){
    this.toastr.error('Veuillez saisir un numéro de téléphone valide commençant par 2, 4, 5, 7 ou 9');
    return;
  }}
  //check cin number

  if (this.fullForm.get('cin')?.value === null) {
    this.toastr.error('Veuillez saisir le CIN du patient');
    return;
  }
  if (this.fullForm.get('cin')?.value!== null)
    if ((this.fullForm.get('cin')?.value).toString().length !== 8) {
      this.toastr.error('Veuillez saisir un CIN valide de 8 chiffres');
      return;
    }
  if (this.fullForm.get('adresse')?.value === null) {
    this.toastr.error('Veuillez saisir l\'adresse du patient');
    return;
  }console.log(formData)
    let fichePatient = this.toFichePatientResponse(formData);
    this.recordsService.updateFichePatient(fichePatient).subscribe(
      response => {

        this.toastr.success('Fiche patient modifiée avec succès');
      },
      error => {

        this.toastr.error('Cin déjà existant');
      }
    )
  }
  ngOnInit(): void {
    this.getFiche();




    initFlowbite();
    this.getImage()
  }

  onSexeChange(event: any) {
    const sexe = event.target.value;
    this.showGynecoObstetriques = sexe === 'Femme';
  }
  FumeurStatusChange:boolean=false
  onFumeurStatusChange(event: any): void {
    const status = event.target.value;
    this.FumeurStatusChange = status === 'EX_FUMEUR';
  }
    calculateIMC:any;
  onIMCChange(event:any)
  {
    const tailleCm = this.fullForm.get('tailleCm')?.value / 100;
    const poidsKg = this.fullForm.get('poidsKg')?.value;
    if (tailleCm && poidsKg) {
      this.calculateIMC = poidsKg / (tailleCm * tailleCm);
      this.fullForm.get('IMC')?.setValue(this.calculateIMC.toFixed(2), { emitEvent: false });
    }

  }

  onAgeChange(event: any) {
    const dateNaissance = this.fullForm.get('dateNaissance')?.value;

    if (dateNaissance) {
      const birthDate = new Date(dateNaissance);
      const currentDate = new Date();

      let ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();
      const dayDifference = currentDate.getDate() - birthDate.getDate();

      // Adjust age if the current month and day are before the birth month and day
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        ageDifference--;
      }

      this.ageCalcule = ageDifference +"";  // Update the property


      // Update the age form control value
      this.fullForm.get('age')?.setValue(this.ageCalcule + " ans", { emitEvent: false });
    }
    this.age = true;
  }




  uploadImage(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    let str = this.route.url
    let parts = str.split('/');


      // Get all parts after the fourth '/'
      let id = parts[4];
    if (!file) {
      console.error('No file selected.');
      return;
    }
    this.recordsService.uploadImage(id, file).subscribe(
      (data: any) => {
      },
      error => {
        this.toastr.error('La taille de l\'image doit être < 1mb.');
      }
    );
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

  changeImage(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0]; // Access the first selected file
    let str = this.route.url
    let parts = str.split('/');


      // Get all parts after the fourth '/'
      let id = parts[4];
    if (!file) {
      return;
    }

    this.recordsService.changeImage(id, file).subscribe(
      (data: any) => {
        this.toastr.success('Image modifiée avec succès.');  },
      error => {
        this.toastr.error('Veuillez vérifier la taille et le format de l\'image.');}
    );

  }
  handleImageChange(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0]; // Access the first selected file

    if (!file) {
      return;
    }

    const reader = new FileReader();
    if (!this.image1) {
      reader.onload = (e: any) => {
        this.uploadImage(event);
        this.image1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    else {
      reader.onload = (e: any) => {
        this.changeImage(event);
        this.image1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  protected readonly changeGroupS = changeGroupS;
  protected readonly changeFumerStaus = changeFumerStaus;
}
