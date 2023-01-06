import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { EmployeesService } from "../employees/employees.service";
import { Employee } from "../employees/employee.model";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
    name: string;
    private employeeSub: Subscription;

    constructor(private employeesService: EmployeesService) {
        this.employeeSub = this.employeesService.login('da001').subscribe(
            (employee: Employee) => {
                this.name = employee.firstName + ' ' + employee.lastName;
            }
        )
    }

    ngOnInit() {
        // this.name = 'test';
        // this.employeeSub = this.employeesService.getLoggedInEmployeeUpdateListener().subscribe((employee: Employee) => {
        //     this.name = employee.firstName + ' ' + employee.lastName;
        //     if (this.name !== 'test') {
        //         this.name = 'test';
        //     }
        // });

        // this.employeesService.login('da001');

    }

    ngOnDestroy() {
        this.employeeSub.unsubscribe();
    }
}