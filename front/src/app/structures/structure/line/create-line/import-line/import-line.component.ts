import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { LineService } from '../../../../Services/line.service';
import { LineTableService } from '../../../../Services/tables-services/line-table.service';
import { toLineResponse } from '../../../../models/LineSimpleResponse';

@Component({
  selector: 'app-import-line',
  templateUrl: './import-line.component.html',
  styleUrls: ['./import-line.component.css']
})
export class ImportLineComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() hideDrawer: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private lineService: LineService,
    private lineTableService: LineTableService
  ) {}

  readFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      this.lineService.createManyLine(json).subscribe(
        (data) => {


          this.lineTableService.addManyLine(data.map(l=>toLineResponse(l,true)))
          this.hideDrawer.emit()
          this.toastr.success("lines created successfully")
          // Reset file input value
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        },
        (error) => {
          this.toastr.error("Error while creating lines");
        }
      );
    };
    reader.readAsArrayBuffer(file);
  }
}
