import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-submit-button',
    imports: [],
    templateUrl: './submit-button.component.html',
    styleUrl: './submit-button.component.scss'
})
export class SubmitButtonComponent {
    @Input() text: string = "Submit";
}
