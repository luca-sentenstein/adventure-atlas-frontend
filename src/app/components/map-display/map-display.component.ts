import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { map } from "rxjs";
import { NgIf } from "@angular/common";
import { Waypoint } from '../../interfaces/waypoint';
import { TripStage } from '../../interfaces/trip-stage';
import MapTypeControlStyle = google.maps.MapTypeControlStyle;
import { StagesManagementService } from '../../services/stages-management.service';

@Component({
  selector: 'app-map-display',
    imports: [GoogleMapsModule, NgIf],
  templateUrl: './map-display.component.html',
  styleUrl: './map-display.component.scss',
})
export class MapDisplayComponent implements OnChanges {
    @ViewChild("map", {static: true}) map!: GoogleMap;

    @Input() stage!: TripStage | null;
    @Input() previewCoordinates: { lat: number; lng: number } | undefined;

    center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
    zoom = 3;
    mapOptions: google.maps.MapOptions = {
        streetViewControl: false,
        cameraControl: false,
        //mapTypeControl: false,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT, // Change position
            style: MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeIds: ["roadmap", "satellite"] // Hide terrain submenu
        }
    }
    // Add directions renderer options to suppress default markers
    directionsRendererOptions: google.maps.DirectionsRendererOptions = {
        suppressMarkers: true, // Hides default markers
        preserveViewport: false // Allows the map to adjust zoom/bounds to fit the route
    };

    directionsResult: google.maps.DirectionsResult | undefined;

    markerPositions: google.maps.LatLng[] = [];
    previewMarkerPosition: google.maps.LatLng | undefined; // Temporary marker for preview
    waypoints: Waypoint[] = [];
    isRoute: boolean | undefined;


    constructor(private directionsService: MapDirectionsService, private stagesService: StagesManagementService) {}

    ngOnChanges(changes: SimpleChanges) {

        if (changes['previewCoordinates']) {
            this.handlePreviewCoordinates(this.previewCoordinates);
        }

        this.handleStageChanges();
    }

    handleStageChanges() {
        const waypoints = this.getWaypoints();
        let rerender = false;

        if (this.stage?.displayRoute !== this.isRoute) {
            this.isRoute = this.stage?.displayRoute;
            rerender = true;
        }

        if (!this.sameWaypoints(this.waypoints, waypoints)) {
            this.waypoints = [...waypoints];
            rerender = true;
        }

        if (rerender) {
            const waypointsLocations = this.getLocations(waypoints);

            if (waypointsLocations.length === 0) {
                this.directionsResult = undefined;
                this.markerPositions = [];
                this.center = { lat: 0, lng: 0 };
                this.zoom = 3;
                this.map.googleMap!.setZoom(3);
                this.panToCenterIfReady();
            } else {
                // Always set markerPositions, even when showing route
                this.markerPositions = waypointsLocations;

                if (this.stage?.displayRoute) {
                    //If isRoute is true but the stage has only one waypoint, go to that waypoint
                    if (waypointsLocations.length === 1) {
                        this.goToRouteStart(waypointsLocations[0]);
                    } else if (waypointsLocations.length > 1) {
                        this.getDirections(waypointsLocations);
                    }
                } else {
                    this.directionsResult = undefined;
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

    // Method to generate A, B, C, etc. based on index
    getMarkerLabel(index: number): string {
        // Convert index to letter (0 = A, 1 = B, etc.)
        return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
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
                this.zoom = 10;
                this.map.googleMap.setZoom(this.zoom);
                this.map.panTo(this.center);
            } else {
                // Multiple markers: fit all within bounds
                const bounds = new google.maps.LatLngBounds();
                this.markerPositions.forEach(position => {
                    bounds.extend(position);
                });
                this.map.googleMap.fitBounds(bounds, 300);
                this.center = {
                    lat: bounds.getCenter().lat(),
                    lng: bounds.getCenter().lng()
                };
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
        return this.stage?.waypoints || [];
    }

    getLocations(waypoints: Waypoint[]): google.maps.LatLng[] {
        if (!waypoints) {
            return [];
        }

        return waypoints
            .filter((waypoint) => waypoint.lat !== undefined && waypoint.lng !== undefined)
            .map((waypoint: Waypoint) => new google.maps.LatLng(waypoint.lat, waypoint.lng)); // Now guaranteed to be google.maps.LatLng and not undefined
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
                waypoint1.lat == waypoint2.lat &&
                waypoint1.lng == waypoint2.lng
            );
        });
    }

    private panToCenterIfReady() {
        if (this.map.googleMap) {
            this.map.panTo(this.center); // Use panTo for smooth transition
        }
    }

    onMarkerDragEnd(event: google.maps.MapMouseEvent, index: number) {
        if (event.latLng) {
            const newPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };

            // Update the marker position
            this.markerPositions[index] = new google.maps.LatLng(newPosition.lat, newPosition.lng);

            // Update the corresponding waypoint
            if (this.waypoints[index]) {

                // Update waypoint
                this.stagesService.updateWaypoint(index, this.waypoints[index].name, newPosition.lat, newPosition.lng);

                // If showing route, recalculate directions
                if (this.stage?.displayRoute && this.waypoints.length > 1) {
                    const waypointsLocations = this.getLocations(this.waypoints);
                    this.getDirections(waypointsLocations);
                } else {
                    this.panToMarkers();
                }
            }
        }
    }
}
