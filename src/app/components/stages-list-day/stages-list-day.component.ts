import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { TripStageElementComponent } from '../trip-stage-element/trip-stage-element.component';
import { Stage } from '../../interfaces/stage';

@Component({
  selector: 'app-stages-list-day',
    imports: [
        CdkDrag,
        CdkDropList,
        TripStageElementComponent,
        CdkDragPlaceholder
    ],
  templateUrl: './stages-list-day.component.html',
  styleUrl: './stages-list-day.component.scss'
})
export class StagesListDayComponent {
    @Input() localStages: Stage[] = [];
    @Input() day!: number; // Add day input to determine the target day
    @Output() stageReordered = new EventEmitter<{
        movedStage: Stage;
        newDay: number;
        newIndex: number;
    }>();



    drop(event: CdkDragDrop<Stage[]>) {
        if (!event.previousContainer.data || !event.container.data) {
            console.error('Drop event data is undefined:', event);
            return;
        }

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            const movedStage = event.container.data[event.currentIndex];
            this.stageReordered.emit({
                movedStage,
                newDay: this.day,
                newIndex: event.currentIndex,
            });
        } else {
            const movedStage = event.previousContainer.data[event.previousIndex];
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.stageReordered.emit({
                movedStage,
                newDay: this.day,
                newIndex: event.currentIndex,
            });
        }
    }
}
