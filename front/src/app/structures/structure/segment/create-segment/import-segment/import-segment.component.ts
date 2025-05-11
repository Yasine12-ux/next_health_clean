import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { SegmentService } from '../../../../Services/segment.service';
import { FormBuilder } from '@angular/forms';
import { SegmentTableService } from '../../../../Services/tables-services/segment-table.service';
import { toSegmentResponse } from '../../../../models/SegmentSimpleResponse';

@Component({
  selector: 'app-import-segment',
  templateUrl: './import-segment.component.html',
  styleUrls: ['./import-segment.component.css']
})
export class ImportSegmentComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() hideDrawer: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private segmentService: SegmentService,
    private fb: FormBuilder,
    private segmentTableService: SegmentTableService
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
      this.segmentService.createManySegment(json).subscribe(
        (res) => {

          this.segmentTableService.addManySegment(res.map(s=>toSegmentResponse(s,true)))
          this.hideDrawer.emit()
          this.toastr.success('Importation réussie');
          // Reset file input value
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        },
        (error) => {
          this.toastr.error('Erreur lors de l\'importation , vérifier l\'information de fichier');
        }
      );
    };
    reader.readAsArrayBuffer(file);
  }
}
