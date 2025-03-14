import { Component, Input } from '@angular/core';
import { Trip } from '../../../interfaces/trip';
import { ButtonLinkComponent } from '../../links/button-link/button-link.component';

@Component({
    selector: 'app-trip-card',
    imports: [
        ButtonLinkComponent
    ],
    templateUrl: './trip-card.component.html',
    styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
    @Input() trip!: Trip;
}
