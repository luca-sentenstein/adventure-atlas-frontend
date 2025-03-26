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
}
