import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlaceSearchResult } from '../../interfaces/place-search-result.interface';

@Component({
  selector: 'app-place-autocomplete',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, GoogleMapsModule],
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.scss'
})
export class PlaceAutocompleteComponent {
    @ViewChild("inputField")
    inputField!: ElementRef;
    @Input() placeholder = ""
    autocomplete: google.maps.places.Autocomplete | undefined;

    constructor(private ngZone: NgZone) { }

    @Output() placeChanged = new EventEmitter<PlaceSearchResult>();


    ngAfterViewInit() {
        this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);

        this.autocomplete.addListener("place_changed", () => {
            const place = this.autocomplete?.getPlace();

            const result: PlaceSearchResult = {
                address: this.inputField.nativeElement.value,
                name: place?.name,
                location: place?.geometry?.location,
                iconUrl: place?.icon,
                imageUrl: this.getPhotoUrl(place),
            };

            this.ngZone.run(() => {
                this.placeChanged.emit(result);
            });

            console.log(result);
        });
    }

    getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined{
        return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl({maxWidth: 5000}) : undefined;
    }
}
