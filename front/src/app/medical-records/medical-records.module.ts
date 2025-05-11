import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalRecordsRoutingModule } from './medical-records-routing.module';
import { TextEditorComponent } from './text-editor/text-editor.component';
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";

import { AttachementComponent } from './attachement/attachement.component';
import { MedicalRecordTableComponent } from './components/medical-record-table/medical-record-table.component';
import { AdministrativeInformationComponent } from './dossier-medical/administrative-information/administrative-information.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FichePatientTableComponent } from './fiche-patient-table/fiche-patient-table.component';
import { FichePatientPageComponent } from './fiche-patient-page/fiche-patient-page.component';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell, CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow, CdkRowDef, CdkTable
} from "@angular/cdk/table";
import {
  ConfirmationDialogComponent
} from "../pages/components/dialogs/comfirmation-dialog/confirmation-dialog.component";
import {PaginationComponent} from "../components/tables-components/pagination/pagination.component";
import { DossierMedicalComponent } from './dossier-medical/dossier-medical.component';
import { NavbarComponent } from './dossier-medical/navbar/navbar.component';
import { ConsultationComponent } from './dossier-medical/consultation/consultation.component';
import { CourierComponent } from './dossier-medical/courier/courier.component';
import { OrdonnaceComponent } from './dossier-medical/ordonnace/ordonnace.component';
import { ExamenComponent } from './dossier-medical/examen/examen.component';
import { ConsultationPageComponent } from './consultation-page/consultation-page.component';
import {AuthInterceptorModule} from "../interceptors/auth-interceptor/auth-interceptor.module";
import { DossierComponent } from './dossier-medical/dossier/dossier.component';
import { OverviewFicheComponent } from './dossier-medical/overview-fiche/overview-fiche.component';


@NgModule({
  declarations: [
    TextEditorComponent,
    AttachementComponent,

    MedicalRecordTableComponent,
      AdministrativeInformationComponent,
      FichePatientTableComponent,
      FichePatientPageComponent,
      DossierMedicalComponent,
      NavbarComponent,
      ConsultationComponent,
      CourierComponent,
      OrdonnaceComponent,
      ExamenComponent,
      ConsultationPageComponent,
      DossierComponent,
      OverviewFicheComponent
  ],
  imports: [
    CommonModule,
    MedicalRecordsRoutingModule,
    CKEditorModule,
    ReactiveFormsModule,
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkTable,
    ConfirmationDialogComponent,
    PaginationComponent,
    CdkHeaderCellDef,
    FormsModule,
    AuthInterceptorModule
  ]
})
export class MedicalRecordsModule { }
