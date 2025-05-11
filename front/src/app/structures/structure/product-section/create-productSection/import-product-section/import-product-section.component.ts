import {Component, EventEmitter, ViewChild, ElementRef, Output} from '@angular/core';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { initFlowbite } from 'flowbite';
import { ProductSectionService } from '../../../../Services/product-section.service';
import { ProductSectionTableService } from '../../../../Services/tables-services/product-section-table.service';
import { toProductSectionResponse } from '../../../../models/ProductSectionSimpleResponse';
import { ProductSectionResponse } from '../../../../models/ProductSectionResponse';

@Component({
  selector: 'app-import-product-section',
  templateUrl: './import-product-section.component.html',
  styleUrls: ['./import-product-section.component.css']
})
export class ImportProductSectionComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() hideDrawer: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private productService: ProductSectionService,
    private productSectionTableService: ProductSectionTableService
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
      this.productService.createManyProduction(json).subscribe(
        (res) => {
          const psT:ProductSectionResponse[] =res.map(p=>toProductSectionResponse(p,true))
          this.productSectionTableService.addManyPs(psT)
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

  ngOnInit(): void {
    initFlowbite();
  }
}
