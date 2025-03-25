import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList, ViewChild,
    ViewChildren
} from '@angular/core';
import {
    CdkDrag,
    CdkDragEnter,
    CdkDragExit,
    CdkDragDrop,
    CdkDragPlaceholder,
    CdkDropList,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TripStageElementComponent } from '../trip-stage-element/trip-stage-element.component';
import { Stage } from '../../interfaces/stage';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { StagesManagementService } from '../../services/stages-management.service';

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
    @ViewChild("listElem") listElement!: ElementRef;
    @ViewChildren("itemElem") itemElements!: QueryList<ElementRef>;
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


    constructor(
        protected stagesService: StagesManagementService,
        private cdr: ChangeDetectorRef,
        private animationBuilder: AnimationBuilder
    ) {}

    onDayClick() {
        const currentDay = this.stagesService.getSelectedDay();
        this.stagesService.selectDay(currentDay === this.day ? null : this.day); // Toggle selection
        this.stagesService.selectStage(null);
    }


    onDragEntered(event: CdkDragEnter<Stage[]>) {
        console.log('Entered Drop List:', this.day);

        //Todo: store player globally to be able to react better to quick enter and exit animation sequences (e. g. destroy old animation before starting the new one)

        let height;

        if(event.container != event.item.dropContainer){
            console.log("different list");

            height = 69 + this.localStages.length * (100) + (this.localStages.length - 1) * 10 + 10 * 2;
        }
        else{
            console.log("original list");

            height = 69 + (this.localStages.length - 1) * (100) + (this.localStages.length - 1) * 10 + 10 * 2;
        }

        const animation = this.animationBuilder.build([
            style({ height: `${height}px` }),
            animate('250ms ease-in-out', style({ height: `${height + 100}px` }))
        ]);


        const player = animation.create(this.listElement.nativeElement);
        player.play();

        //Destroy animation after they are all completed
        setTimeout(() => {
            player.destroy();
        }, 260);
    }

    onDragExit(event: CdkDragExit<Stage[]>) {
        console.log('Exited Drop List:', this.day);

        let height;

        if(event.container != event.item.dropContainer){
            height = 69 + (this.localStages.length + 1) * (100 + 10) + 10;


        }
        else{
            height = 69 + this.localStages.length * (100 + 10) + 10;
        }

        const animation = this.animationBuilder.build([
            style({ height: `${height}px` }),
            animate('250ms ease-in-out', style({ height: `${height - 100}px` }))
        ]);


        const player = animation.create(this.listElement.nativeElement);
        player.play();


        //Destroy animation after they are all completed
        setTimeout(() => {
            player.destroy();
        }, 260);
    }


    drop(event: CdkDragDrop<Stage[]>) {
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
