import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop, CdkDragMove,
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
    @Input() containerRef!: HTMLDivElement
    @Input() localStages: Stage[] = [];
    @Input() day!: number; // Add day input to determine the target day
    @Output() stageReordered = new EventEmitter<{
        movedStage: Stage;
        newDay: number;
        newIndex: number;
    }>();
    @Output() stageDeleted = new EventEmitter<{
        deletedStage: Stage;
    }>();
    isOverTrash = false;


    drop(event: CdkDragDrop<Stage[]>) {
        if (event.isPointerOverContainer) {
            // Dropped inside the container
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
        } else {
            // Dropped outside the container - delete
            this.deleteStage(event.previousIndex);
        }
    }

    private updateStyles() {
        const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
        if (preview) {
            preview.classList.toggle('over-trash', this.isOverTrash);
        }
    }

    dragMoved(event: CdkDragMove<Stage>) {
        const listRect = this.containerRef.getBoundingClientRect();

        if(listRect){
            const pointerX = event.pointerPosition.x;
            const pointerY = event.pointerPosition.y;

            // Check if pointer is outside the container
            this.isOverTrash = (
                pointerX < listRect.left ||
                pointerX > listRect.right ||
                pointerY < listRect.top ||
                pointerY > listRect.bottom
            );
            this.updateStyles();
        }
    }

    private deleteStage(index: number) {
        if (this.localStages && this.localStages.length > index) {
            this.stageDeleted.emit({deletedStage: this.localStages[index]})
            this.localStages.splice(index, 1);
        }
    }
}
