import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import {UsersComponent} from "./users.component";
import {UsersTableComponent} from "./table/users-table/users-table.component";
import {EditUserDetailsComponent} from "./edit-user-details/edit-user-details.component";
import {CreateUserDetailsComponent} from "./create-user-details/create-user-details.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  CdkCell, CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow, CdkHeaderRowDef,
  CdkRow, CdkRowDef,
  CdkTable
} from "@angular/cdk/table";
import {
  ConfirmationDialogComponent
} from "../pages/components/dialogs/comfirmation-dialog/confirmation-dialog.component";
import {PaginationComponent} from "../components/tables-components/pagination/pagination.component";
import { ImportComponent } from './create-user-details/import/import.component';
import {
  StructuresListSelectorComponent
} from "../components/structures-list-selector/structures-list-selector.component";
import {
    StructuresListSelectorItemComponent
} from "../components/structures-list-selector/structures-list-selector-item/structures-list-selector-item.component";



@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    EditUserDetailsComponent,
    CreateUserDetailsComponent,
    ImportComponent,
  ],

  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTable,
    ConfirmationDialogComponent,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderRow,
    CdkRow,
    CdkCell,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkRowDef,
    CdkHeaderRowDef,
    PaginationComponent,
    StructuresListSelectorComponent,

  ]
})
export class UsersModule { }
