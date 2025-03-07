import { Component, Input } from '@angular/core';
import {PlaceDetailsComponent} from "../place-details/place-details.component";
import { PlaceSearchResult } from '../../interfaces/place-search-result';

@Component({
  selector: 'app-waypoints-list',
    imports: [
        PlaceDetailsComponent
    ],
  templateUrl: './waypoints-list.component.html',
  styleUrl: './waypoints-list.component.scss'
})
export class WaypointsListComponent {
    @Input() waypoints!: PlaceSearchResult[];
}
