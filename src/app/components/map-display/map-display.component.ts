import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import {GoogleMap, GoogleMapsModule, MapDirectionsService} from '@angular/google-maps';
import {map} from "rxjs";
import {NgIf} from "@angular/common";
import { Waypoint } from '../../interfaces/waypoint';
import { Stage } from '../../interfaces/stage';

@Component({
  selector: 'app-map-display',
    imports: [GoogleMapsModule, NgIf],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss',
})
export class MapDisplayComponent {
    @ViewChild("map", {static: true}) map!: GoogleMap;

    @Input() stage!: Stage | null;
    @Input() previewCoordinates: { lat: number; lng: number } | undefined;

    center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
    zoom = 3;

    directionsResult: google.maps.DirectionsResult | undefined;

    markerPositions: google.maps.LatLng[] = [];
    previewMarkerPosition: google.maps.LatLng | undefined; // Temporary marker for preview


    constructor(private directionsService: MapDirectionsService) {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.stage);
        const waypoints = this.getWaypoints();
        const waypointsLocations = this.getLocations(waypoints);

        if (changes['previewCoordinates']) {
            this.handlePreviewCoordinates(this.previewCoordinates);
        }
        else{
            if (waypointsLocations.length === 0) {
                this.directionsResult = undefined;
                this.markerPositions = [];
                this.center = { lat: 0, lng: 0 };
                this.zoom = 3;
                this.panToIfReady(this.center);
            }
            else{
                if(this.stage?.isRoute){
                    if (waypointsLocations.length === 1) {
                        this.goToLocation(waypointsLocations[0]);
                    } else if (waypointsLocations.length > 1) {
                        this.getDirections(waypointsLocations);
                    }
                }
                else{
                    this.directionsResult = undefined;
                    this.markerPositions = waypointsLocations;
                }
            }
        }
    }


    handlePreviewCoordinates(coords: { lat: number; lng: number } | undefined) {
        this.previewMarkerPosition = undefined;
        if (coords) {
            this.previewMarkerPosition = new google.maps.LatLng(coords.lat, coords.lng);
            this.center = { lat: coords.lat, lng: coords.lng };
            this.zoom = 15;
            this.panToIfReady(this.center);
        } else if (this.markerPositions) {
            this.center = { lat: this.markerPositions[this.markerPositions.length - 1].lat(), lng: this.markerPositions[this.markerPositions.length - 1].lng() };
            this.zoom = 15;
            this.panToIfReady(this.center);
        } else if (this.getLocations(this.getWaypoints()).length > 0) {
            const firstLocation = this.getLocations(this.getWaypoints())[0];
            this.center = { lat: firstLocation.lat(), lng: firstLocation.lng() };
            this.zoom = 15;
            this.panToIfReady(this.center);
        } else {
            this.center = { lat: 0, lng: 0 };
            this.zoom = 3;
            this.panToIfReady(this.center);
        }
    }

    goToLocation(location: google.maps.LatLng) {
        this.markerPositions.push(location);
        this.previewMarkerPosition = undefined;
        this.center = { lat: location.lat(), lng: location.lng() };
        this.zoom = 15;
        this.directionsResult = undefined;
        this.panToIfReady(this.center);
    }

    getWaypoints(): any[] { // Adjust type based on your Waypoint interface
        return this.stage?.waypoints || [];
    }

    getLocations(waypoints: Waypoint[]): google.maps.LatLng[] {
        if (!waypoints) {
            return [];
        }
        return waypoints
            .filter((waypoint) => waypoint.latitude !== undefined && waypoint.longitude !== undefined)
            .map((waypoint) => new google.maps.LatLng(waypoint.latitude, waypoint.longitude)); // Now guaranteed to be google.maps.LatLng and not undefined
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
            this.markerPositions = [];
            this.previewMarkerPosition = undefined;
            this.center = { lat: waypoints[0].lat(), lng: waypoints[0].lng() }; // Center on first waypoint
            this.zoom = 12; // Adjust zoom for directions
            this.panToIfReady(this.center);
        });
    }

    private panToIfReady(center: google.maps.LatLngLiteral) {
        if (this.map.googleMap) {
            this.map.panTo(this.center); // Use panTo for smooth transition
        } else {
            console.warn('googleMap not available, using center binding');
            // Fallback to center binding if googleMap is not ready
        }
    }
}
