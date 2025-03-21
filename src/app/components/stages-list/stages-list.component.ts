import { Component, ElementRef, ViewChild } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgIf } from '@angular/common';
import { Stage } from '../../interfaces/stage';
import { StagesListDayComponent } from '../stages-list-day/stages-list-day.component';
import { StagesManagementService } from '../../services/stages-management.service';

@Component({
  selector: 'app-stages-list',
    imports: [DragDropModule, StagesListDayComponent, NgIf,
    ],
  templateUrl: './stages-list.component.html',
  styleUrl: './stages-list.component.scss'
})
export class StagesListComponent {
    @ViewChild("container") container!: ElementRef;
    showOptions = false;
    constructor(protected stagesService: StagesManagementService) {}

    toggleOptions() {
        this.showOptions = !this.showOptions;
    }
    //Todo: Deactivate showOptions if user clicks somewhere other than the option buttons

    addNewStage() {
        this.stagesService.addStage(this.stagesService.getTripLength()); //Add stage to last day
        this.showOptions = false; // Close the dropdown after selection
    }

    addNewDay() {
        this.stagesService.addNewDay();
        this.showOptions = false; // Close the dropdown after selection
    }

    onStageReordered(event: { movedStage: Stage; newDay: number; newIndex: number }) {
        this.stagesService.reorderStage(event.movedStage, event.newDay, event.newIndex);
        console.log(event);
    }

    onStageDeleted(event: { deletedStage: Stage }) {
        this.stagesService.deleteStage(event.deletedStage);
    }

    getDayRange(): number[] {
        const length = this.stagesService.getTripLength();
        return Array.from({ length }, (_, i) => i + 1); // Generate days 1 to tripLength
    }
}
