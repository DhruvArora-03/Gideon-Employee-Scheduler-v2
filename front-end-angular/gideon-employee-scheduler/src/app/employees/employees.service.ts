import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Subject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Employee } from './employee.model';

@Injectable({providedIn: 'root'})
export class EmployeesService {
    private loggedInEmployee: Employee;
    private loggedInEmployeeUpdated = new Subject<Employee>();
    private apiUrl = 'http://localhost:6060/';
    private boolTest: boolean = false;
    constructor(private http: HttpClient) {}

    getLoggedInEmployeeUpdateListener() {
        return this.loggedInEmployeeUpdated.asObservable();
    }

    getEID() {
        return this.loggedInEmployee.eid;
    }

    getFullName() {
        return this.loggedInEmployee.firstName + ' ' + this.loggedInEmployee.lastName;
    }

    getTest() {
        return this.http.get(this.apiUrl + 'test');
    }

    login(eid: string) {
        let apiResult: Observable<Employee> = this.http.get<Employee>(this.apiUrl + 'employee/' + eid);
        apiResult.subscribe((employee: Employee) => {
            this.loggedInEmployee.eid = employee.eid;
            this.loggedInEmployee.firstName = employee.firstName;
            this.loggedInEmployee.lastName = employee.lastName;
            this.loggedInEmployeeUpdated.next(employee);
        }).unsubscribe();
        if (!this.boolTest) {
            this.boolTest = true;
            this.login(eid);
        }

        return apiResult;
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