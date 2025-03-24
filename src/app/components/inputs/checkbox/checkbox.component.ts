import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-checkbox',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
    @Input() control!: FormControl;
    @Input() label!: string;
    @Input() id!: string;
}
