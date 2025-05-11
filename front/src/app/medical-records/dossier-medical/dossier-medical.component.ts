import {Component, OnInit} from '@angular/core';
import {initFlowbite} from "flowbite";

@Component({
  selector: 'app-dossier-medical',
  templateUrl: './dossier-medical.component.html',
  styleUrl: './dossier-medical.component.css'
})
export class DossierMedicalComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite()
  }
}
