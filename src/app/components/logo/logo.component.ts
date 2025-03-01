import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-logo',
    imports: [],
    templateUrl: './logo.component.svg',
    styleUrl: './logo.component.scss'
})
export class LogoComponent {
    @Input() width: number = 39; // Default width
    @Input() height: number = 74; // Default height
}
