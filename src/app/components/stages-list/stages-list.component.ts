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
    isHovering = false; // Track if the user is hovering over the button or the menu
    constructor(protected stagesService: StagesManagementService) {}

    openOptions() {
        this.showOptions = true;
        this.isHovering = true;
    }

    keepOptionsOpen() {
        this.isHovering = true;
    }

    closeOptions() {
        this.isHovering = false;

        setTimeout(() => {
            if (!this.isHovering) {
                this.showOptions = false;
            }
        }, 100); // Delay to prevent flickering
    }


    addNewStage() {
        if(this.stagesService.getSelectedDay() != null) {
            this.stagesService.addStage(<number>this.stagesService.getSelectedDay()); //Add stage to selected day
        }
        else{
            if(this.stagesService.getTripLength() != 0) {
                this.stagesService.addStage(this.stagesService.getTripLength()); //Add stage to last day
            }else{
                this.stagesService.addNewDay();
                this.stagesService.addStage(1); // Create first day by adding stage with day 1
            }
        }
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
