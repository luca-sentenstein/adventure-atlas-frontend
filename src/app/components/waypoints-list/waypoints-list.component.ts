import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {WaypointElementComponent} from "../waypoint-element/waypoint-element.component";
import { Waypoint } from '../../interfaces/waypoint';
import { Stage } from '../../interfaces/stage';
import {
    CdkDrag,
    CdkDragDrop, CdkDragMove,
    CdkDragPlaceholder, CdkDragRelease,
    CdkDropList,
} from '@angular/cdk/drag-drop';
import { StagesManagementService } from '../../services/stages-management.service';
import {
    animate,
    AnimationBuilder,
    AnimationPlayer,
    style,
    transition,
    trigger
} from '@angular/animations';

@Component({
    selector: 'app-waypoints-list',
    imports: [
        WaypointElementComponent,
        CdkDrag,
        CdkDropList,
        CdkDragPlaceholder,
    ],
    templateUrl: './waypoints-list.component.html',
    styleUrl: './waypoints-list.component.scss',
    animations: [
        trigger('fadeMove', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ]
})
export class WaypointsListComponent {
    @ViewChild("listContainer") listContainer!: ElementRef;
    @ViewChildren("itemElem") itemElements!: QueryList<ElementRef>;
    @Input() stage!: Stage | null;
    isOverTrash = false;
    skipEnterAnimation = false;

    get waypoints(): Waypoint[] {
        return this.stage?.waypoints || [];
    }


    constructor(
        protected stagesService: StagesManagementService,
        private cdr: ChangeDetectorRef,
        private animationBuilder: AnimationBuilder
    ) {}


    drop(event: CdkDragDrop<Waypoint[]>) {
        if (event.isPointerOverContainer) {
            // Dropped inside the container - reorder
            this.stagesService.reorderWaypoints(event.previousIndex, event.currentIndex);
        }
        // Removal is handled in dragReleased, so no action needed here for outside drops
    }


    dragMoved(event: CdkDragMove<Waypoint>) {
        const listRect = this.listContainer.nativeElement.getBoundingClientRect();
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

    dragReleased(event: CdkDragRelease<Waypoint>) {
        if (this.isOverTrash) {
            const index = this.waypoints.indexOf(event.source.data);

            const elements = this.itemElements.toArray();

            let transforms = [];


            for (let i = 0; i < elements.length; i++) {
                const element = elements[i].nativeElement;

                // Get computed style (checks if element is being transformed)
                const transform = getComputedStyle(element).transform;

                transforms.push(transform);
            }

            console.log(transforms);


            // Create animation for remaining elements
            const animation = this.animationBuilder.build([
                style({ transform: 'translateY(80px)' }),
                animate('300ms ease-out', style({ transform: 'translateY(0)' }))
            ]);


            const players: AnimationPlayer[] = [];
            let placeholderIndex = -1;
            let startIndex;

            //Find index of placeholder
            if (index > 0 && transforms[index - 1] != 'none') {
                //Placeholder above index

                for(let i = index - 1; i >= 0; i--) {
                    if(transforms[i] == 'none') {
                        placeholderIndex = i + 1;
                        break;
                    }else if(i == 0){
                        placeholderIndex = i;
                        break;
                    }
                }

                startIndex = placeholderIndex;


            } else if (index < (transforms.length - 1) && transforms[index + 1] != 'none') {
                //Placeholder below index

                for(let i = index + 1; i < transforms.length; i++) {
                    if(transforms[i] == 'none') {
                        placeholderIndex = i - 1;
                        break;
                    } else if(i == transforms.length - 1){
                        placeholderIndex = i;
                        break;
                    }
                }


                startIndex = placeholderIndex + 1;
            }
            else{
                //Placeholder has same index as the original index of the element

                placeholderIndex = index;

                startIndex = placeholderIndex + 1;
            }

            for (let i = startIndex; i < elements.length; i++) {
                const player = animation.create(elements[i].nativeElement);
                player.play();
                players.push(player);
            }



            //Destroy animation after they are all completed
            setTimeout(() => {
                for (let i = 0; i < players.length; i++) {
                    if(i != index){
                        players[i].destroy();
                    }
                }
            }, 350);

            console.log(index);
            console.log("Detected Placeholder Index:", placeholderIndex);



            this.deleteWaypoint(index);

            //Re-render all waypoints (there is a problem with the reorder animation after one waypoint has been deleted)
            //setTimeout(() => {
            //    this.skipEnterAnimation = true; // Disable enter animation
            //    const waypoints = this.waypoints;
            //    this.stage!.waypoints = []; // Clear array to force full re-render
            //    this.cdr.detectChanges();
//
            //    this.stage!.waypoints = waypoints; // Restore items
            //    this.cdr.detectChanges();
            //    this.skipEnterAnimation = false;
            //}, 350);
        }
    }

    private deleteWaypoint(index: number) {
        if (this.stage && this.waypoints.length > index) {
            //this.stage.waypoints.splice(index, 1);
           this.stagesService.deleteWaypoint(index);
            this.cdr.detectChanges(); // Force change detection to update the DOM
        }
    }

    private updateStyles() {
        const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
        if (preview) {
            preview.classList.toggle('over-trash', this.isOverTrash);
        }
    }
}
