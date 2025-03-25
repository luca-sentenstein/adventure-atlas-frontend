import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
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
    waypoints: Waypoint[] = [];
    isRoute: boolean | undefined;


    constructor(private directionsService: MapDirectionsService) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes['previewCoordinates']) {
            this.handlePreviewCoordinates(this.previewCoordinates);
        }

        this.handleStageChanges();
    }

    handleStageChanges(){
        const waypoints = this.getWaypoints();

        let rerender = false;

        //Re-render only if something has changed
        if(this.stage?.isRoute!=this.isRoute){
            this.isRoute = this.stage?.isRoute;
            rerender = true;
        }

        if(!this.sameWaypoints(this.waypoints, waypoints)){
            this.waypoints = [... waypoints];
            rerender = true;
        }

        if(rerender){
            const waypointsLocations = this.getLocations(waypoints);


            if (waypointsLocations.length === 0) {
                this.directionsResult = undefined;
                this.markerPositions = [];
                this.center = { lat: 0, lng: 0 };
                this.zoom = 3;
                this.map.googleMap!.setZoom(3);
                this.panToCenterIfReady();
            }
            else{
                if(this.stage?.isRoute){
                    //If isRoute is true but the stage has only one waypoint, go to that waypoint
                    if (waypointsLocations.length === 1) {
                        this.goToRouteStart(waypointsLocations[0]);
                    } else if (waypointsLocations.length > 1) {
                        this.getDirections(waypointsLocations);
                    }
                }
                else{
                    this.directionsResult = undefined;
                    this.markerPositions = waypointsLocations;
                    this.panToMarkers();
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
            this.panToCenterIfReady();
        }
        else {
            this.zoom = 15;
            if (this.markerPositions.length > 0) {
                this.panToMarkers();

            } else if (this.getLocations(this.getWaypoints()).length > 0) //effectively a route
            {

                //Pan to last waypoint of route to continue planning the route
                const locations = this.getLocations(this.getWaypoints());
                const lastLocation = locations[locations.length - 1];
                this.center = { lat: lastLocation.lat(), lng: lastLocation.lng() };
                this.panToCenterIfReady();

            }else {
                this.center = { lat: 0, lng: 0 };
                this.zoom = 3;
                this.panToCenterIfReady();
            }
        }
    }

    goToRouteStart(location: google.maps.LatLng) {
        this.markerPositions.push(location);
        this.previewMarkerPosition = undefined;
        this.directionsResult = undefined;
        this.goToLocation(location);
    }

    goToLocation(location: google.maps.LatLng){
        this.center = { lat: location.lat(), lng: location.lng() };
        this.zoom = 10;
        this.panToCenterIfReady();
    }

    panToMarkers(){
        if (this.map.googleMap && this.markerPositions.length > 0) {
            if (this.markerPositions.length === 1) {
                // Single marker: set center and a fixed zoom
                const position = this.markerPositions[0];
                this.center = {
                    lat: position.lat(),
                    lng: position.lng()
                };
                this.zoom = 10; // Matches your goToLocation zoom, adjust as needed
                this.map.googleMap.setZoom(this.zoom);
                this.map.panTo(this.center);
            } else {
                // Multiple markers: fit all within bounds
                const bounds = new google.maps.LatLngBounds();
                this.markerPositions.forEach(position => {
                    bounds.extend(position);
                });
                this.map.googleMap.fitBounds(bounds);
                this.center = {
                    lat: bounds.getCenter().lat(),
                    lng: bounds.getCenter().lng()
                };
                // Optional: Add padding for better framing
                // this.map.googleMap.fitBounds(bounds, { padding: 50 });
            }
            this.panToCenterIfReady(); // Ensure smooth transition
        } else if (this.map.googleMap) {
            // No markers: reset to default
            this.center = {lat: 0, lng: 0};
            this.zoom = 3;
            this.panToCenterIfReady();
        }
    }


    getWaypoints(): Waypoint[]{
        console.log(this.stage?.waypoints);
        return this.stage?.waypoints || [];
    }

    getLocations(waypoints: Waypoint[]): google.maps.LatLng[] {
        if (!waypoints) {
            return [];
        }

        return waypoints
            .filter((waypoint) => waypoint.latitude !== undefined && waypoint.longitude !== undefined)
            .map((waypoint: Waypoint) => new google.maps.LatLng(waypoint.latitude, waypoint.longitude)); // Now guaranteed to be google.maps.LatLng and not undefined
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
        });
    }

    sameWaypoints(arr1: Waypoint[], arr2: Waypoint[]): boolean {
        if (arr1.length != arr2.length) return false;

        return arr1.every((waypoint1, index) => {
            const waypoint2 = arr2[index];
            return (
                waypoint1.id == waypoint2.id &&
                waypoint1.name == waypoint2.name &&
                waypoint1.latitude == waypoint2.latitude &&
                waypoint1.longitude == waypoint2.longitude
            );
        });
    }

    private panToCenterIfReady() {
        if (this.map.googleMap) {
            this.map.panTo(this.center); // Use panTo for smooth transition
        } else {
            console.warn('googleMap not available, using center binding');
            // Fallback to center binding if googleMap is not ready
        }
    }
}
