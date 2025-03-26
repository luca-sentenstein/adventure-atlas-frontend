import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-user-search-bar',
  imports: [],
  templateUrl: './user-search-bar.component.html',
  styleUrl: './user-search-bar.component.scss'
})
export class UserSearchBarComponent {
    @Input() disabled: boolean = false;
    @Output() onClick: EventEmitter<string> = new EventEmitter();
}
