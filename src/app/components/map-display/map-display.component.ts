import { Component, Input, ViewChild } from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result.interface';
import { CommonModule } from '@angular/common';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs';

@Component({
  selector: 'app-map-display',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss'
})
export class MapDisplayComponent {
    @ViewChild("map", {static: true}) map!: GoogleMap;
    @Input() from: PlaceSearchResult | undefined;
    @Input() to: PlaceSearchResult | undefined;

    zoom = 5;

    directionsResult: google.maps.DirectionsResult | undefined;

    markerPosition: google.maps.LatLng | undefined;

    constructor(private directionsService: MapDirectionsService){}

    ngOnChanges(){
        const fromLocation = this.from?.location;
        const toLocation = this.to?.location;

        if(fromLocation && toLocation){
            this.getDirections(fromLocation, toLocation);
        } else if(fromLocation){
            this.goToLocation(fromLocation);
        } else if(toLocation){
            this.goToLocation(toLocation);
        }
    }

    goToLocation(location: google.maps.LatLng){
        this.markerPosition = location;
        this.map.panTo(location);
        this.zoom = 17;
        this.directionsResult = undefined;
    }

    getDirections(from: google.maps.LatLng, to: google.maps.LatLng){
        const request: google.maps.DirectionsRequest = {
            origin: from,
            destination: to,
            waypoints: [],
            travelMode: google.maps.TravelMode.DRIVING,
        };

        this.directionsService.route(request).pipe(
            map(response => response.result)
        ).subscribe((result) => {
            this.directionsResult = result;
            this.markerPosition = undefined;
        })
    }
}
