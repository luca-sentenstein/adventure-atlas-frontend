import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent {
    @Input() control!: FormControl;
    @Input() label!: string;
    @Input() type: string = 'text';
    @Input() id!: string;
}
