import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { StagesManagementService } from '../../services/stages-management.service';

@Component({
  selector: 'app-trip-stage-element',
    imports: [
        NgIf,
        DatePipe
    ],
  templateUrl: './trip-stage-element.component.html',
  styleUrl: './trip-stage-element.component.scss'
})
export class TripStageElementComponent {
    @Input() id!: number; // Unique ID as input
    @Input() title: string = '';
    @Input() startTime: Date | undefined;
    @Input() endTime: Date | undefined;
    @Input() locked: boolean = false; //Attribute could be useful to highlight a draggable item in some way

    constructor(private stagesService: StagesManagementService) {}


    onStageClick() {
        const currentId = this.stagesService.getSelectedStageId();
        this.stagesService.selectStage(currentId === this.id ? null : this.id); // Toggle selection
    }
}
