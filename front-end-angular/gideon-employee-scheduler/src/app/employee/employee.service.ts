import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router'

import { Observable, throwError, take } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Employee } from './employee.model';

@Injectable({providedIn: 'root'})
export class EmployeeService {
    private loggedInEmployee: Employee;
    loggedIn: boolean;
    private apiUrl = 'http://localhost:6060/';
    
    constructor(private http: HttpClient, private router: Router) {
        this.loggedIn=false;
    }

    getEID() {
        if (!this.loggedIn) {
            return "";
        }

        return this.loggedInEmployee.eid;
    }

    getFullName() {
        this.loggedInEmployee = {
            eid: "da001",
            firstName: "Dhruv",
            lastName: "Arora",
        }
        this.loggedIn = true;
        if (!this.loggedIn) {
            return "";
        }
        return this.loggedInEmployee.firstName + ' ' + this.loggedInEmployee.lastName;
    }

    login(eid: string) {
        this.http.get<Employee>(this.apiUrl + 'employee/' + eid).pipe(
            retry(3),
            catchError(this.handleError),
            take(1)
        ).subscribe((employee: Employee) => {
            this.loggedInEmployee = employee;
            if (employee.eid === eid) {
                this.loggedIn=true;
                this.router.navigate(['/home']);
            }
        });
    }

    logout() {
        this.loggedIn=false;
        this.router.navigate(['/login']);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }

}