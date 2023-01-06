import { Component } from '@angular/core';
import { EmployeesService } from '../employees/employees.service';

@Component({
  selector: 'app-shifts-list',
  templateUrl: './shifts-list.component.html',
  styleUrls: ['./shifts-list.component.sass']
})
export class ShiftsListComponent {
  shifts = [
    {
      'date': '2020-01-01',
      'startTime': '08:00',
      'endTime': '16:00',
    },
  ];

  columnsToDisplay: string[] = ['date', 'startTime', 'endTime'];

  constructor(private employeesService: EmployeesService) {
    this.employeesService.login('test01');
  }
}
