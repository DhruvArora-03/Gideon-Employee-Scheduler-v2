import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { EmployeeService } from "../employee/employee.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass']
})
export class LoginComponent {
    selection: string;

    constructor (private employeeService: EmployeeService) { }

    tryLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }

        if (this.selection == "Employee") {
            this.employeeService.login(form.value.eid);
        }
        form.resetForm();
    }
}