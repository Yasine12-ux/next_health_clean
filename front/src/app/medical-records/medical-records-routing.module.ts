import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TextEditorComponent} from "./text-editor/text-editor.component";
import {AdministrativeInformationComponent} from "./dossier-medical/administrative-information/administrative-information.component";
import {FichePatientPageComponent} from "./fiche-patient-page/fiche-patient-page.component";
import {FichePatientTableComponent} from "./fiche-patient-table/fiche-patient-table.component";
import {DossierMedicalComponent} from "./dossier-medical/dossier-medical.component";
import {ConsultationComponent} from "./dossier-medical/consultation/consultation.component";
import {ExamenComponent} from "./dossier-medical/examen/examen.component";
import {CourierComponent} from "./dossier-medical/courier/courier.component";
import {OrdonnaceComponent} from "./dossier-medical/ordonnace/ordonnace.component";
import {ConsultationPageComponent} from "./consultation-page/consultation-page.component";
import {permissionGuard} from "../guard/permission.guard";
import {tokenGuard} from "../guard/token.guard";
import {DossierComponent} from "./dossier-medical/dossier/dossier.component";
import {OverviewFicheComponent} from "./dossier-medical/overview-fiche/overview-fiche.component";

const routes: Routes = [
  {
    path: 'dossier/:id/:name',
    component: DossierMedicalComponent,
    data: { title: 'DOSSIER_MEDICAL' },
    children:[

      {
        path:'consultation',
        component:ConsultationComponent,
        data: { title: 'DOSSIER_MEDICAL' },
        canActivate: [tokenGuard, permissionGuard],

      },

      {
        path: 'fiche-patient',
        component: AdministrativeInformationComponent,
        canActivate: [tokenGuard, permissionGuard],

        data: { title: 'DOSSIER_MEDICAL' }
      },
      {
        path:'overview-fiche',
        component:OverviewFicheComponent,
        data: { title: 'DOSSIER_MEDICAL' },
        canActivate: [tokenGuard, permissionGuard],
      }

    ]
  },
  {path:'dossier',
    component:DossierComponent,
    data: { title: 'DOSSIER_MEDICAL' },
    canActivate: [tokenGuard, permissionGuard],

  },
  {
    path: 'fiche-patient/:id/:name',
    component: AdministrativeInformationComponent,
    canActivate: [tokenGuard, permissionGuard],

    data: { title: 'PATIENT_RECORD' }
  },

  {
    path:'consultation-page/:patientid/:id',
    component:ConsultationPageComponent,
    data: { title: 'DOSSIER_MEDICAL' },
    canActivate: [tokenGuard, permissionGuard],
  },
  {
    path: 'examen',
    component: ExamenComponent,

  },
  {
    path: 'ordonnance',
    component: OrdonnaceComponent,

  },


  {
    path: 'patients',
    component: FichePatientPageComponent,
    data: { title: 'PATIENT_RECORD' },
    canActivate: [tokenGuard, permissionGuard],

  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRecordsRoutingModule { }
