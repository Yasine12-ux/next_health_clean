import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructuresRoutingModule } from './structures-routing.module';
import { StructureComponent } from './structure.component';
import { PlantComponent } from './structure/plant/plant.component';
import { SegmentComponent } from './structure/segment/segment.component';
import { LineComponent } from './structure/line/line.component';
import { NavbarComponent } from './structure/component/navbar/navbar.component';
import {CreatePlantComponent} from "./structure/plant/create-plant/create-plant.component";

import {ProductSectionComponent} from "./structure/product-section/product-section.component";
import {
  CreateProductSectionComponent
} from "./structure/product-section/create-productSection/create-productSection.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateManuelleProductSectionComponent } from './structure/product-section/create-productSection/create-manuelle-product-section/create-manuelle-product-section.component';
import { ImportProductSectionComponent } from './structure/product-section/create-productSection/import-product-section/import-product-section.component';
import {ToastrModule} from "ngx-toastr";
import { CreateSegmentComponent } from './structure/segment/create-segment/create-segment.component';
import { CreateManuelleSegmentComponent } from './structure/segment/create-segment/create-manuelle-segment/create-manuelle-segment.component';
import { ImportSegmentComponent } from './structure/segment/create-segment/import-segment/import-segment.component';
import { CreateLineComponent } from './structure/line/create-line/create-line.component';
import { ImportLineComponent } from './structure/line/create-line/import-line/import-line.component';
import { ManuelleLineComponent } from './structure/line/create-line/manuelle-line/manuelle-line.component';
import {
  CdkCell, CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef, CdkRow, CdkRowDef,
  CdkTable
} from "@angular/cdk/table";
import { DragDropModule } from '@angular/cdk/drag-drop';

import {PaginationComponent} from "../components/tables-components/pagination/pagination.component";
import {
  ProductSectionTableComponent
} from "./structure/product-section/product-section-table/product-section-table.component";
import {SegmentTableComponent} from "./structure/segment/segment-table/segment-table.component";
import {LineTableComponent} from "./structure/line/line-table/line-table.component";
import {PlantTableComponent} from "./structure/plant/table/plants-table/plant-table.component";
import { EditPlantComponent } from './structure/plant/edit-plant/edit-plant.component';
import { EditProductSectionComponent } from './structure/product-section/edit-product-section/edit-product-section.component';
import { EditSegmentComponent } from './structure/segment/edit-segment/edit-segment.component';
import { EditLineComponent } from './structure/line/edit-line/edit-line.component';
import {
    ConfirmationDialogComponent
} from "../pages/components/dialogs/comfirmation-dialog/confirmation-dialog.component";


@NgModule({
    declarations: [
        StructureComponent,
        PlantComponent,
        SegmentComponent,
        LineComponent,
        NavbarComponent,
        CreatePlantComponent,
        CreateProductSectionComponent,
        ProductSectionComponent,
        CreateManuelleProductSectionComponent,
        ImportProductSectionComponent,
        CreateSegmentComponent,
        CreateManuelleSegmentComponent,
        ImportSegmentComponent,
        CreateLineComponent,
        ImportLineComponent,
        ManuelleLineComponent,
        SegmentTableComponent,
        ProductSectionTableComponent,
        LineTableComponent,
        PlantTableComponent,
        EditPlantComponent,
        EditProductSectionComponent,
        EditSegmentComponent,
        EditLineComponent

    ],
    exports: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        StructuresRoutingModule,
        FormsModule,
        ToastrModule,
        ReactiveFormsModule,
        CdkTable,
        CdkHeaderRowDef,
        CdkHeaderCellDef,
        CdkColumnDef,
        CdkHeaderCell,
        CdkHeaderRow,
        CdkRow,
        CdkCell,
        PaginationComponent,
        CdkCellDef,
        CdkRowDef,
        DragDropModule,
        ConfirmationDialogComponent
    ]
})
export class StructuresModule { }
