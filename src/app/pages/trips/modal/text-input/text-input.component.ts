import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'modal-text-input',
    imports: [
        FormsModule,
        NgClass
    ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
export class TextInputComponent {
    @Input() label: string = "";
    @Input() value: string = "";
    @Input() disabled: boolean = false;
    @Output() valueChange = new EventEmitter<string>();

    onInputChange(value: string): void {
        this.valueChange.emit(value);
    }

    get hasValue(): boolean {
        return !!this.value;
    }
}
