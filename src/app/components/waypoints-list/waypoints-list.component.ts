import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {WaypointElementComponent} from "../waypoint-element/waypoint-element.component";
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { Waypoint } from '../../interfaces/waypoint';
import { Stage } from '../../interfaces/stage';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { TripStageElementComponent } from '../trip-stage-element/trip-stage-element.component';
import { StagesManagementService } from '../../services/stages-management.service';
import { PlaceAutocompleteComponent } from '../place-autocomplete/place-autocomplete.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-waypoints-list',
    imports: [
        WaypointElementComponent,
        CdkDrag,
        CdkDropList,
        CdkDragPlaceholder,
    ],
  templateUrl: './waypoints-list.component.html',
  styleUrl: './waypoints-list.component.scss'
})
export class WaypointsListComponent {
    @Input() stage!: Stage | null;

    get waypoints() {
        return this.stage?.waypoints || [];
    }

    constructor(private stagesService: StagesManagementService) {}

    drop(event: CdkDragDrop<Waypoint[]>) {
        this.stagesService.reorderWaypoints(event.previousIndex, event.currentIndex);
    }
}
