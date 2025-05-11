import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, combineLatest, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {UserTableService} from "../../../users/service/user-table.service";
import {ToastrService} from "ngx-toastr";
import {Drawer, DrawerInterface, DrawerOptions, initFlowbite, InstanceOptions} from "flowbite";
import {UserResponse} from "../../../models/user-response";
import {BlockOutService} from "../../services/block-out.service";
import {BlockOutTableService} from "../../services/tables/block-out-table.service";
import {BlockOutResponse} from "../../models/BlockOutResponse";
import {CalendarOptions, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {FullCalendarComponent} from "@fullcalendar/angular";
import frLocale from '@fullcalendar/core/locales/fr';
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import colors from "tailwindcss/colors";
import {SideBarService} from "../../../pages/components/side-bar/side-bar.service";
import {CreateBlockOutComponent} from "../create-block-out/create-block-out.component";

@Component({
  selector: 'app-block-out-table',
  templateUrl: './block-out-month-calendar.component.html',
  styleUrl: './block-out-month-calendar.component.css'
})
export class BlockOutMonthCalendarComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
  @ViewChild(CreateBlockOutComponent) createBlockOutComponent!: CreateBlockOutComponent;


  private subscription: Subscription|undefined;

  blockOuts:BlockOutResponse[]=[]

  toEdit:BlockOutResponse|undefined

  constructor(
    private sideBarService:SideBarService,
    private blockOutService:BlockOutService,
    private blockOutTableService:BlockOutTableService
    ) {
  }
  drawer: DrawerInterface|null = null

  ngOnInit() {
    // set the drawer menu element
    const $targetEl: HTMLElement|null = document.getElementById('drawer-timepicker');

// options with default values
    const options: DrawerOptions = {
      placement: 'left',
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      backdropClasses:
        'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30',
      onHide: () => {
      },
      onShow: () => {
      },
      onToggle: () => {
      },
    };
    const instanceOptions: InstanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer($targetEl, options, instanceOptions);

    this.blockOutService.findAll().subscribe(
      data=>{
        this.blockOuts=data
        this.blockOutTableService.setBlockBS(data)
      }
    )
  }

  selectedMonth= this.formatMonth(new Date(Date.now()))


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dayMaxEventRows:3,
    events: [],
    height:600,

    locale: frLocale,
    headerToolbar:{
      left: '',
      center: '',
      right: ''
    },
    windowResize: () => {
      this.fullcalendar.getApi().updateSize();
    },
      eventClick:(args)=> {
        this.toEdit=this.blockOuts.find(bo=>bo.id.toString()==args.event.id)
        this.createBlockOutComponent.toEdit=this.toEdit
        this.createBlockOutComponent.fillDefault()
        this.drawer?.show()
      }
    ,
    eventResize:(args)=>{
      this.blockOuts.forEach(bo=>{
        if(bo.id.toString()==args.event.id){
          let newBo=bo;
          if(args.event.end)
            bo.endDate=args.event.end?.toISOString().slice(0, 10)
          this.blockOutService.update(bo).subscribe(
            data=>{
            },
            error => {
              args.revert()
            }
          )
        }
      })

    }
  };
  ngAfterViewInit(): void {
    window.addEventListener('resize', this.onWindowResize);
    this.subscription=this.sideBarService.getState().subscribe(newState=>{
        this.fullcalendar.getApi().updateSize();
    })
    this.blockOutTableService.getBlockBS().subscribe(
      data=>{
        this.blockOuts=data
        this.fullcalendar.getApi().removeAllEvents()
        for (let block of data) {
          this.addRDV(block)
        }
      }
    )
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize);
    this.subscription?.unsubscribe();

  }

  private onWindowResize = (): void => {
    this.fullcalendar.getApi().updateSize(); // Update FullCalendar's size when the window is resized
  };
  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr)
  }
  handleEventClick(arg:EventClickArg) {
    alert('date click! ' + arg.event.id)
  }
  goToNextMonth() {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.next(); // Navigate to the next month
    this.selectedMonth=this.formatMonth(calendarApi.getDate())
  }

  goToPreviousMonth() {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.prev(); // Navigate to the previous month
    this.selectedMonth=this.formatMonth(calendarApi.getDate())
  }

  goToToday() {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.today(); // Navigate to today's date
    this.selectedMonth=this.formatMonth(calendarApi.getDate())
  }
  formatMonth(date: Date): string {
    return format(date, 'MMMM, yyyy', { locale: fr });
  }
  addRDV(blockOutResponse:BlockOutResponse) {
    const calendarApi = this.fullcalendar.getApi();
    const endDate= blockOutResponse.endDate
    const date = new Date(endDate);

    date.setDate(date.getDate()+1)

    calendarApi.addEvent({id:blockOutResponse.id.toString(), title: `${blockOutResponse.startTime.substring(0,5)} à ${blockOutResponse.endTime.substring(0,5)}`,date:blockOutResponse.startDate, end:date.toISOString().slice(0,10),color:"red",durationEditable:true });
  }
  protected readonly alert = alert;
}
