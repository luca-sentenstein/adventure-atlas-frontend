import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PlaceSearchResult } from '../../interfaces/place-search-result';
import { StagesManagementService } from '../../services/stages-management.service';
import { PlaceAutocompleteComponent } from '../place-autocomplete/place-autocomplete.component';

@Component({
  selector: 'app-searchbar',
    imports: [
        PlaceAutocompleteComponent
    ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {
    @ViewChild("autocompleteInputField") autocompleteInputField!: PlaceAutocompleteComponent;
    @Output() newCoordinates = new EventEmitter<{ lat: number; lng: number } | undefined>();

    searchResult: PlaceSearchResult | undefined;


    constructor(private stagesService: StagesManagementService) {}

    addWaypoint() {
        if (this.searchResult) {

            //Todo: make it possible to edit the name before adding the point
            this.stagesService.addNewWaypoint(this.searchResult.name, this.searchResult.location?.lat(), this.searchResult.location?.lng());
            this.searchResult = undefined;
            this.autocompleteInputField.resetValue();
        }
    }

    handleNewSearchResult(result: PlaceSearchResult | undefined) {
        this.searchResult = result;
        // Extract coordinates from PlaceSearchResult
        if (result && result.location) {
            const coords = {
                lat: result.location.lat(),
                lng: result.location.lng()
            };
            this.newCoordinates.emit(coords);
        } else {
            this.newCoordinates.emit(undefined);
        }
    }
}
