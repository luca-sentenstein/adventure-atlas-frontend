import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { Trip } from '../interfaces/trip';
import { AUTH_REQUIRED } from '../interceptors/request.interceptor';

@Injectable({
    providedIn: 'root'
})
export class DiscoverService {

    constructor(private http: HttpClient) {
    }

    getAllPublicTrips() {
        return this.http.get<Trip[]>(
            BASE_URL + "/trip/discover",
            {
                context: new HttpContext().set(AUTH_REQUIRED, false)
            });
    }
}
