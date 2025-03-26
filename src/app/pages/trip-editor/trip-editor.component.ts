import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSectionComponent } from '../../components/edit-section/edit-section.component';
import { MapDisplayComponent } from '../../components/map-display/map-display.component';
import { WaypointsListComponent } from '../../components/waypoints-list/waypoints-list.component';
import { StagesListComponent } from '../../components/stages-list/stages-list.component';
import { StagesManagementService } from '../../services/stages-management.service';
import { TripStage } from '../../interfaces/trip-stage';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { DayPanelComponent } from '../../components/day-panel/day-panel.component';

@Component({
  selector: 'app-trip-editor',
    imports: [CommonModule, EditSectionComponent, MapDisplayComponent, WaypointsListComponent, StagesListComponent, SearchbarComponent, DayPanelComponent],
  templateUrl: './trip-editor.component.html',
  styleUrl: './trip-editor.component.scss',
    animations: [
// Animation for waypoints-list (slides left)
        trigger('fadeInOutLeft', [
            state('hidden', style({
                transform: 'translateX(-20px)',
                opacity: 0,
                zIndex: -1
            })),
            state('visible', style({
                transform: 'translateX(0)',
                opacity: 1,
                zIndex: 10
            })),
            transition('hidden => visible', [
                animate('0.4s ease-in-out')
            ]),
            transition('visible => hidden', [
                animate('0.4s ease-in-out')
            ])
        ]),
        // Animation for searchbar (slides up)
        trigger('fadeInOutUp', [
            state('hidden', style({
                transform: 'translateY(-20px)',
                opacity: 0,
                zIndex: -1
            })),
            state('visible', style({
                transform: 'translateY(0)',
                opacity: 1,
                zIndex: 10
            })),
            transition('hidden => visible', [
                animate('0.4s ease-in-out')
            ]),
            transition('visible => hidden', [
                animate('0.4s ease-in-out')
            ])
        ]),
        // Animation for day panel (slides down)
        trigger('fadeInOutDown', [
            state('hidden', style({
                transform: 'translateY(60px) scale(0.5)',
                opacity: 0,
                zIndex: -1
            })),
            state('visible', style({
                transform: 'translateY(0) scale(1)',
                opacity: 1,
                zIndex: 10
            })),
            transition('hidden => visible', [
                animate('0.4s ease-in-out')
            ]),
            transition('visible => hidden', [
                animate('0.4s ease-in-out')
            ])
        ]),
        // Animation for edit-section (slides right)
        trigger('fadeInOutRight', [
            state('hidden', style({
                transform: 'translateX(20px)',
                opacity: 0,
                zIndex: -1
            })),
            state('visible', style({
                transform: 'translateX(0)',
                opacity: 1,
                zIndex: 10
            })),
            transition('hidden => visible', [
                animate('0.4s ease-in-out')
            ]),
            transition('visible => hidden', [
                animate('0.4s ease-in-out')
            ])
        ])
    ]
})
export class TripEditorComponent {
    selectedStage: TripStage | null = null;

    constructor(protected stagesService: StagesManagementService) {
        this.stagesService.selectedStage$.subscribe(stage => {
            this.selectedStage = stage; // Update selected stage
        });
    }

    previewCoordinates: { lat: number; lng: number } | undefined;

    onPreviewCoordinates(coords: { lat: number; lng: number } | undefined) {
        this.previewCoordinates = coords;
    }
}
