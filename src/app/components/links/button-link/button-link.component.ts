import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-button-link',
    imports: [
        RouterLink
    ],
    templateUrl: './button-link.component.html',
    styleUrl: './button-link.component.scss'
})
export class ButtonLinkComponent {
    @Input() link: string = '';
}
