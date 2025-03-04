import { Component, Input } from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result.interface';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-details',
  imports: [CommonModule, MatCardModule],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.scss'
})
export class PlaceDetailsComponent {
    @Input() data: PlaceSearchResult | undefined;
}
