import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RolesTableComponent } from './table/roles-table/roles-table.component';
import {BrowserModule} from "@angular/platform-browser";
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell, CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow, CdkRowDef, CdkTable
} from "@angular/cdk/table";
import {
    ConfirmationDialogComponent
} from "../pages/components/dialogs/comfirmation-dialog/confirmation-dialog.component";
import {PaginationComponent} from "../components/tables-components/pagination/pagination.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateRoleDetailsComponent} from "./create-role-details/create-role-details.component";
import {EditRoleDetailsComponent} from "./edit-role-details/edit-role-details.component";


@NgModule({
  declarations: [
    RolesComponent,
    CreateRoleDetailsComponent,
    EditRoleDetailsComponent,
    RolesTableComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkTable,
    ConfirmationDialogComponent,
    PaginationComponent,
    ReactiveFormsModule,
    CdkHeaderCellDef,
    FormsModule,
  ]
})
export class RolesModule { }
