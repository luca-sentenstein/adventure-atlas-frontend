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
    @Input() color: string = "#1E1E1E"; // Default color
    @Input() hoverColor: string = "#1E1E1E"; // Default hover color
    protected color_: string = this.color;

    onMouseOver() {
        this.color_ = this.hoverColor;
    }

    onMouseLeave() {
        this.color_ = this.color
    }
}
