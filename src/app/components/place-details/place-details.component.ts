import { Component, Input } from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-place-details',
    imports: [
        NgIf
    ],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent {
    @Input() waypoint: PlaceSearchResult | undefined;
}
