import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { EmployeeService } from "../employee/employee.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
    name: string;

    constructor(private employeeService: EmployeeService, private router: Router) {
    }
    
    ngOnInit() {
        // if (!this.employeeService.loggedIn) {
        //     this.router.navigate(['/login']);
        // }
        this.name = this.employeeService.getFullName();
    }

    ngOnDestroy() {
        this.name = "";
    }

    tryLogout() {
        this.employeeService.logout();
    }
}