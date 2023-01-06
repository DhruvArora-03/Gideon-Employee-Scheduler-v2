import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.sass']
})
export class EmployeeListComponent {
  employees = [
    {
      id: 'da782',
      firstName: 'Dhruv',
      lastName: 'Arora',
    },
    {
      id: 'da782',
      firstName: 'Dhruv',
      lastName: 'Arora',
    },
    {
      id: 'da782',
      firstName: 'Dhruv',
      lastName: 'Arora',
    },
    {
      id: 'da782',
      firstName: 'Dhruv',
      lastName: 'Arora',
    },
  ];

  columnsToDisplay = ['id', 'firstName', 'lastName'];
}
