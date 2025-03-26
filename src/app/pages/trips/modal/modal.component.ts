import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Trip } from '../../../interfaces/trip'
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { UserSearchBarComponent } from './user-search-bar/user-search-bar.component';
import { FormsModule } from '@angular/forms';
import { TripsService } from '../../../services/trips.service';
import { TextInputComponent } from './text-input/text-input.component';
import { deepCopy } from '../../../utils/utils';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-modal',
    imports: [
        NgClass,
        NgIf,
        UserSearchBarComponent,
        NgForOf,
        FormsModule,
        TextInputComponent
    ],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
    @ViewChild("modal") modal!: ElementRef<HTMLElement>;
    @ViewChild("navbar") navbar!: ElementRef<HTMLElement>;
    @ViewChild("footer") footer!: ElementRef<HTMLElement>;
    @ViewChild("fileInputBox") fileInputBox!: ElementRef<HTMLElement>;
    @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
    @Input({ required: true }) trip!: Trip;
    @Output() saveTrip: EventEmitter<{ original: Trip, updated: Trip }> = new EventEmitter();
    @Output() cancel: EventEmitter<Trip> = new EventEmitter();
    @Output() deleteTrip: EventEmitter<number> = new EventEmitter();
    originalTrip: Trip = { ...this.trip };
    activePage: string = "image";
    previewBoxHovered: boolean = false;

    constructor(private tripsService: TripsService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.originalTrip = deepCopy(this.trip);
    }

    isOwner(): boolean {
        return this.trip.owner.id === this.authService.getUser()?.id;
    }

    hasWriteAccess(): boolean {
        const access = this.trip.tripAccesses.find(access => access.user.id === this.authService.getUser()?.id);
        return this.isOwner() || access?.accessLevel === "write";
    }

    switchPage(page: string) {
        if (this.activePage !== page) {
            this.activePage = page;

            if (page === "image") {
                this.modal.nativeElement.style.height = "25rem";
                this.navbar.nativeElement.style.height = "17%";
                this.footer.nativeElement.style.height = "20%";
            } else if (page === "access") {
                this.modal.nativeElement.style.height = "34.375rem";
                this.navbar.nativeElement.style.height = "12.36%";
                this.footer.nativeElement.style.height = "14.54%";
            } else {
                this.modal.nativeElement.style.height = "29.688rem";
                this.navbar.nativeElement.style.height = "14.31%";
                this.footer.nativeElement.style.height = "16.84%";
            }
        }
    }

    openFileUpload() {
        this.fileInput.nativeElement.click();
    }

    onFileChange() {
        const file = this.fileInput.nativeElement.files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.trip.image = e.target?.result;
            }
            reader.readAsDataURL(file);
        }
    }

    clearImage() {
        if (this.previewBoxHovered) {
            this.trip.image = null;
            this.fileInput.nativeElement.value = "";
        }
    }

    addAccess(username: string) {
        this.tripsService.addAndUpdateTripAccess({
            userName: username,
            trip: this.trip.id,
            accessLevel: "read"
        }).subscribe({
            next: tripAccess => {
                this.trip.tripAccesses.push(tripAccess);
                this.originalTrip.tripAccesses.push(deepCopy(tripAccess));
            },
            error: err => {
                alert("Could not add access: " + err.message);
            }
        });
    }

    removeAccess(id: number) {
        this.tripsService.removeTripAccess(id).subscribe({
            next: () => {
                this.trip.tripAccesses = this.trip.tripAccesses.filter(tripAccess => tripAccess.id !== id);
                this.originalTrip.tripAccesses = this.originalTrip.tripAccesses.filter(tripAccess => tripAccess.id !== id);
            },
            error: err => {
                alert("Could not remove access: " + err.message);
            }
        });
    }
}
