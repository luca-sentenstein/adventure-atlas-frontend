import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Trip, TripCreate } from '../interfaces/trip';
import { TripAccess } from '../interfaces/trip-access';
import { TripAccessDTO } from '../utils/utils';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TripsService {

    constructor(private http: HttpClient, private authService: AuthService) {

    }

    getAllTrips() {
        return this.http.get<Trip[]>(
            BASE_URL + "/trip"
        )
    }

    createTrip(trip: TripCreate) {
        return this.http.post<Trip>(
            BASE_URL + "/trip",
            trip
        ).pipe(
            map((data: Trip) => this.transformTrip(data))
        )
    }

    updateTrip(tripId: number, changes: Partial<Trip>) {
        return this.http.patch(
            BASE_URL + "/trip/" + tripId,
            changes
        )
    }

    deleteTrip(tripId: number) {
        return this.http.delete(
            BASE_URL + "/trip/" + tripId
        )
    }

    addAndUpdateTripAccess(tripAccess: TripAccessDTO) {
        return this.http.post<TripAccess>(
            BASE_URL + "/trip/access",
            tripAccess
        )
    }

    removeTripAccess(tripAccessId: number) {
        return this.http.delete(
            BASE_URL + "/trip/access/" + tripAccessId
        )
    }

    private transformTrip(trip: any): Trip {
        return {
            ...trip,
            owner: this.authService.getUser(),
            createdAt: new Date(trip.createdAt),
            updatedAt: new Date(trip.updatedAt),
            startDate: new Date(trip.startDate)
        };
    }

}
