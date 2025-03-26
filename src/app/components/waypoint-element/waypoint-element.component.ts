import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Waypoint } from '../../interfaces/waypoint';

@Component({
  selector: 'app-waypoint-element',
    imports: [
        NgIf
    ],
  templateUrl: './waypoint-element.component.html',
  styleUrl: './waypoint-element.component.scss'
})
export class WaypointElementComponent {
    @Input() waypoint!: Waypoint;
}
