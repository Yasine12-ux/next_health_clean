import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as XLSX from "xlsx";
import {ProductSectionResponse} from "../../../structures/models/ProductSectionResponse";
import {toProductSectionResponse} from "../../../structures/models/ProductSectionSimpleResponse";
import {initFlowbite} from "flowbite";
import {UserTableService} from "../../service/user-table.service";
import {ToastrService} from "ngx-toastr";
import {UsersService} from "../../../services/users.service";
import {copyUserResponse, UserResponse} from "../../../models/user-response";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent  implements OnInit{
  @Output()hideDrawer:EventEmitter<any>=new EventEmitter<any>()
  constructor(private userService: UsersService,
              private toastr: ToastrService,
              private userTableService: UserTableService,
             ) {
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
      this.userService.createManyUsers(json).subscribe(
        (res) => {
          const ur:UserResponse[] =res.map(p=>copyUserResponse(p))
          this.userTableService.addManyusers(ur)
          this.hideDrawer.emit()
          this.toastr.success('Importation réussie');
        },
        (error) => {
          this.toastr.error('Erreur lors de l\'importation , vérifier l\'information de fichier');
        }

      );


    }
    reader.readAsArrayBuffer(file);
  }

  ngOnInit(): void {

    initFlowbite()
  }
}
