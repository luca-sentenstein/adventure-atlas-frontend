import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../../../interfaces/trip';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-trip-list',
    imports: [
        NgForOf,
        AsyncPipe,
        DatePipe
    ],
  templateUrl: './trip-list.component.html',
  styleUrl: './trip-list.component.scss'
})
export class TripListComponent {
    @Input() trips$!: Observable<Trip[]>;
    @Output() editTrip: EventEmitter<Trip> = new EventEmitter();

    evaluateDays(trip: Trip) {
        if (!trip.stages) return 0;
        return trip.stages.reduce((max, stage) => Math.max(max, stage.day), 0);
    }
}
