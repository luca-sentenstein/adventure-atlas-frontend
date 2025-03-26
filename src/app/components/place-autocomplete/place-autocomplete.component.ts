import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlaceSearchResult } from '../../interfaces/place-search-result';

@Component({
  selector: 'app-place-autocomplete',
  imports: [GoogleMapsModule],
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.scss'
})
export class PlaceAutocompleteComponent implements AfterViewInit {
    @ViewChild("inputField") inputField!: ElementRef;

    @Input() placeholder = ""
    @Input() writeAccess!: boolean;

    @Output() newSearchResult = new EventEmitter<PlaceSearchResult>();

    autocomplete: google.maps.places.Autocomplete | undefined;

    constructor(private ngZone: NgZone) { }

    ngAfterViewInit() {
        this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);

        this.autocomplete.addListener("place_changed", () => {
            const place = this.autocomplete?.getPlace();

            const result: PlaceSearchResult = {
                address: place?.formatted_address,
                location: place?.geometry?.location,
                imageUrl: undefined, //Would be "this.getPhotoUrl(place)" but we don't need the image right now
                iconUrl: undefined, //Would be "place?.icon" but we don't need the icon right now
                name: place?.name
            };

            this.ngZone.run(() => {
                this.newSearchResult.emit(result);
            })

            console.log(place); //just for debugging
        });
    }

    getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined{
        return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({maxWidth: 500}) : undefined;
    }

    public resetValue() {
        this.inputField.nativeElement.value = "";
    }

    onInputChange() {
        if (this.inputField.nativeElement.value === '') {
            this.newSearchResult.emit(undefined); // Clear on empty input
        }
    }
}
