import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSectionComponent } from '../../components/edit-section/edit-section.component';
import { MapDisplayComponent } from '../../components/map-display/map-display.component';
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { WaypointsListComponent } from '../../components/waypoints-list/waypoints-list.component';
import { StagesListComponent } from '../../components/stages-list/stages-list.component';

@Component({
  selector: 'app-trip-editor',
    imports: [CommonModule, EditSectionComponent, MapDisplayComponent, WaypointsListComponent, StagesListComponent],
  templateUrl: './trip-editor.component.html',
  styleUrl: './trip-editor.component.scss'
})
export class TripEditorComponent {
    waypoints!: Array<PlaceSearchResult>;
}
