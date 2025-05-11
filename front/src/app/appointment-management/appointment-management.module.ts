import {NgModule, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentManagementRoutingModule } from './appointment-management-routing.module';
import {AppointmentManagementComponent} from "./appointment-management.component";
import {initFlowbite} from "flowbite";
import { AppointmentsTableComponent } from './table/appointments-table/appointments-table.component';
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
import {AuthInterceptor} from "../interceptors/auth.interceptor";
import {AuthInterceptorModule} from "../interceptors/auth-interceptor/auth-interceptor.module";
import { TabsComponent } from './tabs/tabs.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AppointmentHeaderComponent } from './appointment-header/appointment-header.component';
import { CreateAppointmentComponent } from './create-appointment/create-appointment.component';
import {
    StructuresListSelectorComponent
} from "../components/structures-list-selector/structures-list-selector.component";
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { BlockOutComponent } from './block-out/block-out.component';
import { BlockOutMonthCalendarComponent } from './block-out/block-out-calendar/block-out-month-calendar.component';
import {FullCalendarModule} from "@fullcalendar/angular";
import {CreateBlockOutComponent} from "./block-out/create-block-out/create-block-out.component";
import { AppointmentDashBoardComponent } from './appointment-dash-board/appointment-dash-board.component';
import {DashbordComponent} from "./Dashboads/dashbord/dashbord.component";
import { CardRDVComponent } from './appointment-dash-board/components/card-rdv/card-rdv.component';
import { SimpleCardComponent } from './appointment-dash-board/components/simple-card/simple-card.component';
import { PieChartComponent } from './appointment-dash-board/components/pie-chart/pie-chart.component';
import { RadialChartComponent } from './appointment-dash-board/components/radial-chart/radial-chart.component';
import { ListCalendarComponent } from './appointment-dash-board/components/list-calendar/list-calendar.component';
import { LineChartComponent } from './appointment-dash-board/components/line-chart/line-chart.component';
import {PieChartsComponent} from "./Dashboads/dashbord/pie-chart/pie-chart.component";
import { PieChartFemmeComponent } from './Dashboads/dashbord/pie-chart-femme/pie-chart-femme.component';



@NgModule({
    declarations: [
        AppointmentManagementComponent,
        AppointmentsTableComponent,
        TabsComponent,
        CalendarComponent,
        AppointmentHeaderComponent,
        CreateAppointmentComponent,
        AppointmentDetailsComponent,
        BlockOutComponent,
        BlockOutMonthCalendarComponent,
        CreateBlockOutComponent,
        AppointmentDashBoardComponent,
      DashbordComponent,
      CardRDVComponent,
      SimpleCardComponent,
      PieChartComponent,
      RadialChartComponent,
      ListCalendarComponent,
      LineChartComponent,
      PieChartsComponent,
      PieChartFemmeComponent
    ],
  exports: [
    CalendarComponent,
    CreateAppointmentComponent,
    AppointmentsTableComponent
  ],
    imports: [
        CommonModule,
        AppointmentManagementRoutingModule,
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
        FormsModule,
        CdkHeaderCellDef,
        AuthInterceptorModule,
        StructuresListSelectorComponent,
        FullCalendarModule,
    ]
})
export class AppointmentManagementModule implements OnInit{
  ngOnInit() {
    initFlowbite()
  }
}
