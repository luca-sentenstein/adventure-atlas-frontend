import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {PlaceAutocompleteComponent} from "../place-autocomplete/place-autocomplete.component";
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { WaypointElementComponent } from '../waypoint-element/waypoint-element.component';
import { Stage } from '../../interfaces/stage';
import { StagesManagementService } from '../../services/stages-management.service';
import { Waypoint } from '../../interfaces/waypoint';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { handleAutoChangeDetectionStatus } from '@angular/cdk/testing';

@Component({
  selector: 'app-edit-section',
    imports: [
        DatePipe,
        FormsModule,
    ],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss'
})
export class EditSectionComponent {
    @Input() tripID!: number;


    stage: Stage | null = null;



    constructor(private stagesService: StagesManagementService) {
        this.stagesService.selectedStage$.subscribe(stage => {
            this.stage = stage; // Update stage when selection changes
        });
    }



    updateStage() {
        if (this.stage) {
            this.stagesService.updateStage(this.stage);
        }
    }

    updateTime(field: 'startTime' | 'endTime', event: Event) {
        if (!this.stage) return;
        const input = event.target as HTMLInputElement;
        const timeValue = input.value; // Format: "HH:mm"
        if (timeValue) {
            const [hours, minutes] = timeValue.split(':').map(Number);
            const date = this.stage[field] instanceof Date ? new Date(this.stage[field]!) : new Date();
            date.setHours(hours, minutes, 0, 0);
            this.stage[field] = date;
            this.updateStage();
        } else {
            this.stage[field] = undefined;
            this.updateStage();
        }
    }


}
