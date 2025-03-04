import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlaceAutocompleteComponent } from './components/place-autocomplete/place-autocomplete.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlaceSearchResult } from './interfaces/place-search-result.interface';
import { PlaceDetailsComponent } from './components/place-details/place-details.component';
import { MapDisplayComponent } from './components/map-display/map-display.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, PlaceAutocompleteComponent, MatToolbarModule, PlaceDetailsComponent, MapDisplayComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'adventure-atlas';
    fromValue: PlaceSearchResult | undefined;
    toValue: PlaceSearchResult | undefined;
}
