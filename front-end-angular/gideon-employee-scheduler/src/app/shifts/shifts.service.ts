import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, take } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { EmployeeService } from '../employee/employee.service';
import { Shift } from './shift.model';

@Injectable({providedIn: 'root'})
export class ShiftsService {
    private apiUrl = 'http://localhost:6060/';
    
    constructor(private http: HttpClient, private employeeService: EmployeeService) {}

    getShifts(eid: string) {
        return this.http.get<Shift[]>(this.apiUrl + 'shifts/' + eid).pipe(
            retry(3),
            catchError(this.handleError),
            take(1)
        );
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