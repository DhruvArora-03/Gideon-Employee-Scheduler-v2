import { Component } from "@angular/core";


@Component({
    selector: 'app-availability-display',
    templateUrl: './availability-display.component.html',
    styleUrls: ['./availability-display.component.sass']
})
export class AvailabilityDisplayComponent {
    availabilities = [
        {
            day: 'Monday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Tuesday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Wednesday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Thursday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Friday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Saturday',
            earliest: '08:00',
            latest: '16:00',
        },
        {
            day: 'Sunday',
            earliest: '08:00',
            latest: '16:00',
        },
    ];

    columnsToDisplay = ['day', 'earliest', 'latest'];
}