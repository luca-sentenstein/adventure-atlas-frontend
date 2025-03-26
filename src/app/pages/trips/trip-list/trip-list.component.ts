import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../../../interfaces/trip';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { Router } from '@angular/router';

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

    constructor(private router: Router) {
    }

    navigateToTripEdit(trip: Trip) {
        void this.router.navigate(['/trips/edit', trip.id]);
    }

    clickEditTrip($event: MouseEvent,trip: Trip) {
        $event.stopPropagation();
        this.editTrip.emit(trip);
    }
}
