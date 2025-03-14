import { Component } from '@angular/core';
import { DiscoverService } from '../../services/discover.service';
import { Trip } from '../../interfaces/trip';
import { catchError, Observable } from 'rxjs';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TripCardComponent } from '../../components/cards/trip-card/trip-card.component';

@Component({
  selector: 'app-discover',
    imports: [
        AsyncPipe,
        TripCardComponent,
        NgIf,
        NgForOf
    ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss'
})
export class DiscoverComponent {
    trips$: Observable<Trip[]> = new Observable<Trip[]>();
    protected message: string = "Currently there are no public trips available";

    constructor(private service: DiscoverService) {
        this.trips$ = this.service.getAllPublicTrips().pipe(
            catchError(_ => {
                this.message = "Could not connect to server"
                return new Observable<Trip[]>();
            })
        );
    }

    trackById(_: number, trip: Trip) {
        return trip.id;
    }
}
