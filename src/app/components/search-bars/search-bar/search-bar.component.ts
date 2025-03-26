import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-search-bar',
    imports: [],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
    @Output() onInput: EventEmitter<string> = new EventEmitter();
    @Input() placeholder: string = "Search...";
}
