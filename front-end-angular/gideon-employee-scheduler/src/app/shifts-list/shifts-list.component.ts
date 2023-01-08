import { Component, OnInit } from '@angular/core';

import { Shift } from '../shifts/shift.model';

import { ShiftsService } from '../shifts/shifts.service';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-shifts-list',
  templateUrl: './shifts-list.component.html',
  styleUrls: ['./shifts-list.component.sass']
})
export class ShiftsListComponent implements OnInit {
  shifts: Shift[];
  temp: any;
  locale_en = 'en-US';
  locale_date_options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  };
  locale_time_options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Chicago',
  };

  columnsToDisplay: string[] = ['Date', 'Start Time', 'End Time'];

  constructor(private shiftsService: ShiftsService, private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.shiftsService.getShifts(this.employeeService.getEID()).subscribe((shifts: Shift[]) => {
      this.shifts = shifts;
      
      for (let i = 0; i < this.shifts.length; i++) {
        this.shifts[i].start = new Date(this.shifts[i].start);
        this.shifts[i].end = new Date(this.shifts[i].end);
      }
    });
  }
}
