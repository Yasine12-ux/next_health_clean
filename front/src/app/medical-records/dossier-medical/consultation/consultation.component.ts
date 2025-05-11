import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { PlantSimpleResponse } from '../../../structures/models/PlantSimpleResponse';
import { ProductSectionResponse } from '../../../structures/models/ProductSectionResponse';
import { StructureMiniResponse } from '../../../structures/models/StructureMiniResponse';
import { UserStructureResponse } from '../../../structures/models/UserStructureResponse';
import { FichePatientService } from '../../service/fiche-patient.service';
import { FichePatientTableService } from '../../service/tables/fiche-patient-table.service';
import { ToastrService } from 'ngx-toastr';

import { initFlowbite } from 'flowbite';
import { RecordsService } from "../../service/records.service";
import { Router } from "@angular/router";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as jspdf from "jspdf";

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent implements OnInit, AfterViewInit {
  tableDataSource$ = new BehaviorSubject<any[]>([]);
  displayedColumns$ = new BehaviorSubject<string[]>([
    'motif',
    "poidsKg",
    "pouls",
    "taille_cm",
    'complete',
    "date",
    "action"
  ]);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  dataSize = 0;
  dataOnPage$ = new BehaviorSubject<any[]>([]);
  searchFormControl = new FormControl();
  sortKey$ = new BehaviorSubject<string>('name');
  sortDirection$ = new BehaviorSubject<string>('asc');

  plants: PlantSimpleResponse[] = [];
  selectedPsId: number = 0;
  Pss: ProductSectionResponse[] = [];
  selectedSegmentId: number = 0;
  segments: StructureMiniResponse[] = [];
  selectedLineId: number = 0;
  lines: StructureMiniResponse[] = [];
  workers: UserStructureResponse[] = [];

  constructor(
    private record: RecordsService,
    private toastr: ToastrService,
    private route: Router
  ) { }

  ngAfterViewInit(): void { }

  ngOnInit() {
    initFlowbite();
    this.getAllConsult();

    combineLatest([this.tableDataSource$, this.searchFormControl.valueChanges, this.sortKey$, this.sortDirection$, this.currentPage$, this.pageSize$])
      .subscribe(([data, searchTerm, sortKey, sortDirection, currentPage, pageSize]) => {
        let filteredData = data;

        if (searchTerm) {
          filteredData = data.filter(item => Object.values(item).some((value: any) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())));
        }

        const sortedData = filteredData.sort((a, b) => {
          if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
          if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
          return 0;
        });

        this.dataSize = sortedData.length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        this.dataOnPage$.next(sortedData.slice(start, end));
      });

    this.searchFormControl.setValue('');
  }

  changeCurrentPage(page: number) {
    this.currentPage$.next(page);
  }

  adjustSort(key: string) {
    if (this.sortKey$.value === key) {
      this.sortDirection$.next(this.sortDirection$.value === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey$.next(key);
      this.sortDirection$.next('asc');
    }
  }

  changePageSize$(nbPage: number) {
    this.pageSize$.next(nbPage);
    this.changeCurrentPage(1);
  }

  handleClick(i: number) {
    const radioButton = document.getElementById(`filter-radio-user-${i}`) as HTMLInputElement;
    radioButton.checked = true;
    this.changePageSize$(i);
  }

  private updateTableDataSource(data: any) {
    this.tableDataSource$.next(data);
  }

  getAllConsult() {
    const str = this.route.url;
    const parts = str.split('/');
    const id = parts[4];
    this.record.getAllConsult(id).subscribe((data: any) => {
      this.updateTableDataSource(data);
    }, error => {
      console.error(error);
    });
  }



  consultDetails(id:number)
  {   const str = this.route.url;
    const parts = str.split('/');
    const patientId = parts[4];
    this.route.navigateByUrl('home/medical-records/consultation-page/'+patientId+'/'+id)
  }






  //ordonnance






}
