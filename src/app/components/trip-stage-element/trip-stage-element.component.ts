import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-trip-stage-element',
    imports: [
        NgIf
    ],
  templateUrl: './trip-stage-element.component.html',
  styleUrl: './trip-stage-element.component.scss'
})
export class TripStageElementComponent {
    @Input() title: string = '';
    @Input() startTime: Date | undefined;
    @Input() endTime: Date | undefined;
    @Input() locked: boolean = false; //Attribute could be useful to highlight a draggable item in some way
}
