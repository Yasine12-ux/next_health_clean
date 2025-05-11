import { Component } from '@angular/core';

import {jsPDF} from "jspdf";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../services/users.service";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ordonnace',
  templateUrl: './ordonnace.component.html',
  styleUrl: './ordonnace.component.css'
})
export class OrdonnaceComponent {

  constructor(private toast:ToastrService,private userS:TokenStorageService,private route:Router) {
  }

  doctorName = this.userS.getUser().username;
  patientName = '';
  date = new Date().toLocaleDateString();
  ordonnance = '';

  generatePDF() {
    const doc = new jsPDF();
    const str = this.route.url;
    const parts = str.split('/');
    const name = parts[5];
    this.patientName = name || 'Not provided'; // Ensure a default value if name is undefined

    if (this.ordonnance) {
      // Title
      doc.setFontSize(22);
      doc.setTextColor(100, 150, 200); // Black
      doc.text('Ordonnance', 105, 20, { align: 'center' });

      // Doctor's name
      doc.setFontSize(15);
      doc.text(`Médecin : ${this.doctorName}`, 20, 40);

      // Patient information
      doc.setFontSize(14);
      doc.text(`Patient Name: ${this.patientName}`, 20, 50);

      // Ordonnance section
      doc.setFontSize(14);
      doc.setLineWidth(0.5);
      doc.setDrawColor(100, 150, 200);
      doc.rect(20, 75, 170, 80); // Ordonnance box
      doc.text(this.ordonnance, 24, 82, { maxWidth: 166 });

      // Date
      doc.setFontSize(14);
      doc.text(`Date: ${this.date}`, 20, 170);

      // Signature
      doc.setFontSize(14);
      doc.text('Signature: __________________', 130, 170);

      // Open print dialog
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } else {
      this.toast.error("Vous devez remplir l'ordonnance");
    }
  }




}

export const generateOrdonnancePDF=( patientName?:string,doctorName?:string,ordonnance?:string,date?:string ,autoPrint:boolean=true)=> {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 139); // Dark Blue
  doc.text('Ordonnance', 105, 20, { align: 'center' });

  // Doctor's name
  doc.setFontSize(15);
  doc.setTextColor(0, 0, 0); // Black
  doc.text(`Médecin : ${doctorName}`, 20, 40);

  // Patient information
  doc.setFontSize(14);
  doc.text(`Patient Name: ${patientName}`, 20, 50);

  // Ordonnance section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Black
  doc.setLineWidth(0.5);
  doc.rect(20, 75, 170, 80); // Ordonnance box
  doc.text(ordonnance+"", 22, 80, { maxWidth: 166 });

  // Date
  doc.setFontSize(14);
  doc.text(`Date: ${date}`, 20, 170);

  // Signature
  doc.setFontSize(14);
  doc.text('Signature: __________________', 130, 170);

  // Open print dialog
  if(autoPrint)
    doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
}
