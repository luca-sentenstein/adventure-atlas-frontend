import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {PlaceAutocompleteComponent} from "../place-autocomplete/place-autocomplete.component";
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { PlaceDetailsComponent } from '../place-details/place-details.component';

@Component({
  selector: 'app-edit-section',
    imports: [
        PlaceAutocompleteComponent,
        PlaceDetailsComponent
    ],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss'
})
export class EditSectionComponent {
    @ViewChild("autocompleteInputField") autocompleteInputField!: PlaceAutocompleteComponent;
    @Input() tripID!: number;
    @Input() stageID!: number;
    @Output() waypointsChanged = new EventEmitter<PlaceSearchResult[]>()

    waypoint: PlaceSearchResult | undefined;
    waypoints: PlaceSearchResult[] = [];


    addWaypoint() {
        if (this.waypoint) {
            this.waypoints.push(this.waypoint);
            this.waypoint = undefined;
            this.waypointsChanged.emit([...this.waypoints]); //New array to make sure to trigger ngOnChanged (only pushing doesn't change the reference)
            this.autocompleteInputField.resetValue();
        }
    }
}
