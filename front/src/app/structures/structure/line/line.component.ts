import { Component } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import * as XLSX from "xlsx";

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrl: './line.component.css'
})
export class LineComponent {
  constructor(private toastr:ToastrService) {
  }


  readFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);


      this.toastr.success('Importation réussie');
    }
    reader.readAsArrayBuffer(file);
  }
}
