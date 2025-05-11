import { Component } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../../services/auth-services/token-storage.service";
import {Router} from "@angular/router";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrl: './courier.component.css'
})
export class CourierComponent {
  doctorName: string;
  patientName: string;
  date: string;
  ordonnance: string;
  destinataire: string;

  constructor(private toast:ToastrService,private userS:TokenStorageService,private route:Router) {
    this.doctorName = this.userS.getUser().username;
    this.patientName = '';
    this.date = new Date().toLocaleDateString();
    this.ordonnance = '';
    this.destinataire = '';
  }

  generatePDF() {
    const doc = new jsPDF();
    const str = this.route.url;
    const parts = str.split('/');
    const name = parts[5];
    this.patientName = name;

    if (this.ordonnance || this.destinataire) {
      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 139); // Dark Blue
      doc.text('Courrier', 105, 20, { align: 'center' });

      // Doctor's name
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0); // Black
      doc.text(`Médecin : ${this.doctorName}`, 20, 40);

      // Patient information
      doc.setFontSize(14);
      doc.text(`Patient Name: ${this.patientName}`, 20, 60);

      // Destinataire
      doc.text(`Destinataire: ${this.destinataire}`, 20, 50);

      // Ordonnance section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Black
      doc.setLineWidth(0.5);
      doc.rect(20, 75, 170, 80);
      doc.text(this.ordonnance, 22, 80, { maxWidth: 166 });

      // Date
      doc.setFontSize(14);
      doc.text(`Date: ${this.date}`, 20, 170);

      // Signature
      doc.setFontSize(14);
      doc.text('Signature: __________________', 130, 170);

      doc.save('Courrier.pdf');
    } else {
      this.toast.error("Vous devez remplir l'Courrier " );
    }
  }
}


