import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Trip } from '../interfaces/trip';

@Injectable({
    providedIn: 'root'
})
export class DiscoverService {

    constructor(private http: HttpClient) {
    }

    getAllPublicTrips() {
        return this.http.get<Trip[]>(BASE_URL + "/trip/discover");
    }
}
