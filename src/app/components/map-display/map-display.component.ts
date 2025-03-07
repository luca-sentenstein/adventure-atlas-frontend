import {Component, Input, ViewChild} from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import {GoogleMap, GoogleMapsModule, MapDirectionsService} from '@angular/google-maps';
import {map} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-map-display',
    imports: [GoogleMapsModule, NgIf],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss',
})
export class MapDisplayComponent {
    @ViewChild("map", {static: true}) map!: GoogleMap;

    @Input() waypoints!: PlaceSearchResult[];
    @Input() isRoute!: boolean;

    zoom = 5;

    directionsResult: google.maps.DirectionsResult | undefined;

    markerPosition: google.maps.LatLng | undefined;


    constructor(private directionsService: MapDirectionsService) {}

    ngOnChanges() {
        console.log(this.waypoints);
        const waypointsLocations = this.getLocations()

        if(waypointsLocations.length == 0){
            this.directionsResult = undefined;
            this.markerPosition = undefined;
        }else if (waypointsLocations.length == 1){
            this.goToLocation(waypointsLocations[0]);
        }else if (waypointsLocations.length > 1){
            this.getDirections(waypointsLocations);
        }
    }

    goToLocation(location: google.maps.LatLng){
        this.markerPosition = location;
        this.map.panTo(location);
        this.zoom = 17;
        this.directionsResult = undefined;
    }

    getLocations(): google.maps.LatLng[] {
        if (!this.waypoints) {
            return [];
        }
        return this.waypoints
            .filter((waypoint): waypoint is { location: google.maps.LatLng } => waypoint.location !== undefined)
            .map(waypoint => waypoint.location); // Now guaranteed to be google.maps.LatLng and not undefined
    }


    getDirections(waypoints: Array<google.maps.LatLng>){
        const actualWaypoints: google.maps.DirectionsWaypoint[] = waypoints.slice(1, - 1).map(latLng => ({
            location: latLng,
            stopover: false,
        }));

        const request: google.maps.DirectionsRequest = {
            origin: waypoints[0],
            waypoints: actualWaypoints,
            destination: waypoints[waypoints.length - 1],
            travelMode: google.maps.TravelMode.DRIVING,
        };

        this.directionsService.route(request).pipe(
            map(response => response.result)
        ).subscribe(result => {
            this.directionsResult = result;
            this.markerPosition = undefined;
        });
    }
}
