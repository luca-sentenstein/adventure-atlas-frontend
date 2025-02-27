import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlaceAutocompleteComponent } from './components/place-autocomplete/place-autocomplete.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlaceSearchResult } from './interfaces/place-search-result.interface';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, PlaceAutocompleteComponent, MatToolbarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'adventure-atlas';
    fromValue: PlaceSearchResult | undefined;
}
