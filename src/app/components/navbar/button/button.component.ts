import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'navbar-button',
    imports: [
        NgClass
    ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
    @Output() onClick = new EventEmitter<void>();
    @Input() isPage: boolean = false;
}
