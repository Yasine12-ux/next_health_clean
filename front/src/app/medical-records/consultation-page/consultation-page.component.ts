import {Component, Input, OnInit} from '@angular/core';
import {RecordsService} from "../service/records.service";
import {ConsultationResponse} from "../models/ConsultationResponse";
import {OrdonnanceResponse} from "../models/OrdonnanceResponse";
import {prepareDateTime} from "../../appointment-management/appointment-details/appointment-details.component";
import {ActivatedRoute, Router} from "@angular/router";
import Stringifier from "postcss/lib/stringifier";
import {ExamenResponse} from "../models/ExamenResponse";
import {FullConsultationResponse} from "../models/FullConsultationResponse";
import {generateOrdonnancePDF} from "../dossier-medical/ordonnace/ordonnace.component";
import {AuthService} from "../../services/auth-services/auth.service";
import {TokenStorageService} from "../../services/auth-services/token-storage.service";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import {CustomUploadAdapter} from "../text-editor/custom-upload-adapter";
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {jsPDF} from "jspdf";
import {ToastrService} from "ngx-toastr";
import {AIService} from "../service/ai.service";
import {AiRequest} from "../models/AiRequest";
import {FichePatientResponse} from "../models/FichePatientResponse";

@Component({
  selector: 'app-consultation-page',
  templateUrl: './consultation-page.component.html',
  styleUrl: './consultation-page.component.css'
})
export class ConsultationPageComponent implements OnInit{

  detailleConsDrawer: DrawerInterface|null = null

  fichePatient:FichePatientResponse|undefined


  fullConsultation: FullConsultationResponse = {
    consultation: {complete:false}
  } as FullConsultationResponse;

  constructor(
    private recordsService: RecordsService,
    private route: ActivatedRoute,
    private storageService: TokenStorageService,
    private toastr: ToastrService,
    private aiService:AIService
    ) {
  }

  listConsultation: ConsultationResponse[] = []
  listOrdonnance:OrdonnanceResponse[] = []
  listExamen:ExamenResponse[] = []

  patientId: number = 0;
  consultationId: number = 0;
  ngOnInit() {
    initFlowbite()
    const $targetEl: HTMLElement|null = document.getElementById('drawer-detaille-consultation');


// options with default values
    const options: DrawerOptions = {
      placement: 'right',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
    };
    const instanceOptions: InstanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.detailleConsDrawer = new Drawer($targetEl, options, instanceOptions);



  this.patientId = this.route.snapshot.params['patientid'];
    this.consultationId = this.route.snapshot.params['id'];

    if(this.patientId == 0 || this.consultationId == 0)
      return;

    this.recordsService.getFullConsultation(this.consultationId.toString()).subscribe(
      (data) => {
        this.fullConsultation = data;
        if(this.fullConsultation.consultation.complete) {
          // if the consultation is complete, we show all the data
          if(this.fullConsultation.ordonnance!= null)
            this.listOrdonnance = [this.fullConsultation.ordonnance];
          if(this.fullConsultation.examens!= null)
            this.listExamen = this.fullConsultation.examens;


        }else{
          // if the consultation is not complete, we show only the last 3 consultation, ordonnance and examen
          this.recordsService.getAllConsult( this.patientId.toString()).subscribe(
            (data) => {
              // keep the last 3 consultation
              this.listConsultation = data.sort((a, b) => {
                  if(a.date == null || b.date == null) return 0;
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
              ).slice(1,4)
            }
          )
          this.recordsService.getAllOrdonnancebyPatient(this.patientId.toString()).subscribe(
            (data) => {

              this.listOrdonnance = data.sort((a, b) => {
                  if(a.date == null || b.date == null) return 0;
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
              ).slice(0,3)
            }
          )
          this.recordsService.getAllExamenbyPatient(this.patientId.toString()).subscribe(
            (data) => {
              this.listExamen = data.sort((a, b) => {
                  if(a.date == null || b.date == null) return 0;
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
              ).slice(0,3)
            }
          )
        }
      }
    )


  }

  fullBiometrie: boolean =false;
  fullOrdonnance: boolean =false;
  fullExamen: boolean =false;

  // TODO : use popup for the comfirmation of the completion of the consultation , its easier to use

  showOrHideBiometrie(){
    this.fullBiometrie = !this.fullBiometrie;
  }
  showOrHideOrdonnance(){
    this.fullOrdonnance = !this.fullOrdonnance;
  }
  showOrHideExamen(){
    this.showAddExamen=true;
  }

  ordonnanceDescription: string = "";
  ordonnanceCategory: string = "";

  printOrdonnance(){
    let doctorname = this.storageService.getUser().username
    let date = new Date().toLocaleDateString();
    generateOrdonnancePDF(this.fullConsultation.consultation.patientFullName, doctorname,this.ordonnanceDescription , date,true)
  }


  public Editor = DecoupledEditor;


  consultationDetailleToShow: ConsultationResponse | undefined

  public onReady(editor: DecoupledEditor): void {
    const element = editor.ui.getEditableElement()!;
    const parent = element.parentElement!;
    parent.insertBefore(
      editor.ui.view.toolbar.element!,
      element
    );


    parent.insertBefore(
      editor.ui.view.toolbar.element!,
      element
    );

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader);
    };
  }
  public editorConfig = {
    ui: {
      viewportOffset: {
        bottom: 50
      }
    }
  }

  public EditorDetaille = DecoupledEditor;

  public onReady2(editor: DecoupledEditor): void {
    const element = editor.ui.getEditableElement()!;
    const parent = element.parentElement!;

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader);
    };
  }
  public editorConfigDetaille = {

    ui: {
      viewportOffset: {
        bottom: 50
      }
    }
  }

  completeFullConsultation(){
    if (this.fullConsultation.consultation.motif == "" || this.fullConsultation.consultation.motif == null){
      this.toastr.error("Veuillez remplir le motif de la consultation")
      return
    }

    this.fullConsultation.ordonnance = this.listOrdonnance[0];

    this.fullConsultation.consultation.id = Number(this.consultationId);
    this.fullConsultation.consultation.idPatient = Number(this.patientId);

    this.fullConsultation.consultation.complete = true;

    if(this.fullConsultation.ordonnance == null){
      this.fullConsultation.ordonnance = {
        description: this.ordonnanceDescription,
        categorie: this.ordonnanceCategory
      }
    }
    if(this.ordonnanceCategory=="" && this.ordonnanceDescription==""){
      this.fullConsultation.ordonnance = undefined
    }else{
      this.fullConsultation.ordonnance = {
        description: this.ordonnanceDescription,
        categorie: this.ordonnanceCategory
      }
    }
    console.log("step2")

    this.recordsService.saveFullConsultation(this.fullConsultation).subscribe(
      (data) => {
        this.listOrdonnance= (data.ordonnance) ?[data.ordonnance] : []
        this.listExamen = this.fullConsultation.examens || []
        console.log("before",this.fullConsultation)
        this.fullConsultation = data
        console.log("after",this.fullConsultation)
        this.toastr.success("Consultation complétée avec succès")
        console.log("step3")

        this.trainModel()
        console.log("step4")

      }
    )
  }

  showDetailleConsultation(consultation: ConsultationResponse){
    this.consultationDetailleToShow =consultation
    this.detailleConsDrawer?.show()
  }



  protected readonly prepareDateTime = prepareDateTime;

  openOrdonnance(row: OrdonnanceResponse) {
    let doctorname = this.storageService.getUser().username
    let date = new Date().toLocaleDateString();
    generateOrdonnancePDF(this.fullConsultation.consultation.patientFullName, doctorname,row.description , date,false)
  }

  doctorName: string="";
  patientName: string="";
  date: string="";
  address: string="";
  phone: string="";
  birthDate: string="";
  treatmentReason: string="";
  selectedRegion: string="Radiographie(s)";
  showOtherInput: boolean = false;
  otherRegion: string="";
  showAddExamen: boolean=false;
  showDetailExamen: boolean=false;
  showDetailExamenEditable: boolean=false;

  examenDetailleToShow ={
    id:0,
    date: "",
    type: "",
    regionexamenee: "",
    resultat: ""
  }


  saveExamen(){
    this.showAddExamen = false;

    const examen: ExamenResponse = {
      date: this.date,
      type: this.treatmentReason,
      regionexamenee: this.selectedRegion
    }

    this.recordsService.createExamen(this.consultationId, examen).subscribe(
      (data) => {
        this.fullConsultation.examens?.push(data)
      }
    )

    // set examen to the first index of the list and remove the last
    this.listExamen.unshift(examen)
    this.listExamen.pop()
    this.imprimeExamen()

  }
// todo : update the examen
  openDetailExamen(examen: ExamenResponse,editable: boolean=false){
    this.examenDetailleToShow ={
      id: examen.id||0,
      date: examen.date,
      type: examen.type,
      regionexamenee: examen.regionexamenee||"",
      resultat: examen.resultat || ""
    }
    this.showDetailExamenEditable = editable;
    this.showDetailExamen = true;
  }


  imprimeExamen() {
    const doc = new jsPDF();

    const datenow= new Date().toLocaleDateString();
    // Title
    doc.setFontSize(22);
    doc.setTextColor(100, 150, 200); // Black
    doc.text('DEMANDE D\'EXAMEN', 105, 20, { align: 'center' });
    // Doctor's name
    doc.setFontSize(15);
    doc.text(`Médecin : ${this.doctorName}`, 20, 40);

    // Patient information
    doc.setFontSize(12);
    doc.text(`Nom de Patient: ${this.patientName}`, 20, 50);

    doc.text(`Tél. prof.: ${this.phone}`, 20, 60);

    // Motif (Treatment Reason)
    doc.setFontSize(12);
    doc.text(`Examen: ${this.selectedRegion}`, 20, 70);

    // Region to examine
    doc.setFontSize(14);
    doc.setLineWidth(0.5);
    doc.text('Région à examiner:', 20, 80);
    doc.setDrawColor(100, 150, 200);
    doc.rect(20, 90, 170, 40);

    doc.text(this.treatmentReason, 22, 100, { maxWidth: 166 });

    // Other region if selected
    // if (this.selectedRegion === 'Autre') {
    //   doc.text(`Autre région: ${this.selectedRegion}`, 20, 170);
    // }

    // Date
    doc.setFontSize(14);
    doc.text(`Date: ${datenow}`, 20, 150);

    // Signature
    doc.setFontSize(14);
    doc.text('Signature: __________________', 130, 150);

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

  addResultatExamen() {
    this.showDetailExamenEditable = false;
    this.showDetailExamen = false;

    this.recordsService.updateExamen(this.examenDetailleToShow).subscribe(
      (data) => {
        this.examenDetailleToShow = {
          id: 0,
          date: "",
          type: "",
          regionexamenee: "",
          resultat: ""
        }
        this.listExamen=this.listExamen.map((examen2) => {
              if (data.id == examen2.id) {
                return data
              }
              return examen2
            })
          }
        )
  }

  protected readonly alert = alert;

  perdict() {
    console.log("call ai")
  }

  recommendation:string[]|undefined

  selecteRecommendation(index: number){
    this.ordonnanceDescription+=this.recommendation![index]+"\n"
    // this.recommendation?.splice(index, 1)
  }

  callAI() {

    this.recordsService.getFichePatient(this.patientId.toString()).subscribe(
      (data) => {
        this.fichePatient = data

        let diagnostic = this.fullConsultation.consultation.motif+" "+this.fullConsultation.consultation.diagnostic?.toString() // todo :clean the diagnostic


        const cleanDiag = getTextFromHTML(diagnostic)

        let aiRequest:AiRequest = {
          ...data,
          diagnostic: cleanDiag
        }

        console.log("AI req:",aiRequest)
        this.aiService.recommend(aiRequest).subscribe(
          (data) => {
            this.recommendation = data["prescription"]
            console.log(data)
          },
          error =>
          {
            console.log(error)
          }
        )

      }
    )
  }

  trainModel() {
    console.log("step 3.3")
    console.log(this.fullConsultation)
    let diagnostic = this.fullConsultation.consultation.motif+" "+this.fullConsultation.consultation.diagnostic?.toString() // todo :clean the diagnostic

    console.log("step 3.5")

    const cleanDiag = getTextFromHTML(diagnostic)
    console.log("fichePatient",this.fichePatient)
    const aiRequest:AiRequest = {
       ...this.fichePatient,
        diagnostic: cleanDiag,
        prescription: this.ordonnanceDescription
     }
    console.log("AI req:",aiRequest)
    this.aiService.train(aiRequest).subscribe(
      (data) => {
        console.log(data)
      },
      error =>
      {
        console.log(error)
      }
    )
  }
}
function getTextFromHTML(htmlString: string): string {
  // Create a new DOMParser instance
  const parser = new DOMParser();

  // Parse the HTML string into a Document
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Get the text content from the document body
  const textContent = doc.body.textContent || "";

  return textContent.trim(); // Trim any extra whitespace
}
