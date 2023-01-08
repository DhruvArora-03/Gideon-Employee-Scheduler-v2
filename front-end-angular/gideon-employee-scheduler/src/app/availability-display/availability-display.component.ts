import { Component, OnInit } from "@angular/core";

import { AvailabilityData } from "../availability/availability.model";

import { AvailabilityService } from "../availability/availability.service";
import { EmployeeService } from "../employee/employee.service";

const COLUMN_SCHEME = [
    {
        key: 'day',
        label: 'Day',
        type: 'string'
    },
    {
        key: 'available',
        label: 'Available',
        type: 'checkbox'
    },
    {
        key: 'earliest',
        label: 'Earliest',
        type: 'string'
    },
    {
        key: 'latest',
        label: 'Latest',
        type: 'string'
    },
    {
        key: 'isEdit',
        label: '',
        type: 'isEdit'
    }
];

@Component({
    selector: 'app-availability-display',
    templateUrl: './availability-display.component.html',
    styleUrls: ['./availability-display.component.sass']
})
export class AvailabilityDisplayComponent implements OnInit {
    availabilities: AvailabilityData[];
    columnsSchema: any[] = COLUMN_SCHEME;
    temp: string;

    columnsToDisplay = ['day', 'available', 'earliest', 'latest', 'isEdit'];

    constructor(private employeesService: EmployeeService, private availabilityService: AvailabilityService) {}

    update(element: AvailabilityData) {
        // this.temp = this.availabilities.indexOf(element).toString();
        this.availabilityService.updateAvailability(this.employeesService.getEID(), element).subscribe((data) => {});

    }

    ngOnInit() {
        this.availabilityService.getAvailabilities(this.employeesService.getEID()).subscribe((data: AvailabilityData[]) => {
            this.availabilities = data;
        });
    }

}