import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../../../services/auth-services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent {
  doctorName: string;
  patientName: string;
  date: string;
  address: string;
  phone: string;
  birthDate: string;
  treatmentReason: string;
  selectedRegion: string;
  showOtherInput: boolean = false;
  otherRegion: string;

  constructor(private toast: ToastrService, private userS: TokenStorageService, private route: Router) {
    this.doctorName = this.userS.getUser().username;
    this.patientName = 'aziz';
    this.date = new Date().toLocaleDateString();
    this.address = '';
    this.phone = '';
    this.birthDate = '';
    this.treatmentReason = '';
    this.selectedRegion = 'Radiographie(s)';
    this.otherRegion = '';
  }

  generatePDF() {
    const doc = new jsPDF();
    const str = this.route.url;
    const parts = str.split('/');
    const name = parts[5];
    this.patientName=name
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
    doc.text(`Date: ${this.date}`, 20, 150);

    // Signature
    doc.setFontSize(14);
    doc.text('Signature: __________________', 130, 150);

    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  }

}
