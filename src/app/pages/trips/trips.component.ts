import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bars/search-bar/search-bar.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { TripsService } from '../../services/trips.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trip, TripCreate } from '../../interfaces/trip';
import { AsyncPipe, NgIf } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { getTripAccessChanges, getTripChanges } from '../../utils/utils';
import { CreateModalComponent } from './create-modal/create-modal.component';

@Component({
    selector: 'app-trips',
    imports: [
        SearchBarComponent,
        TripListComponent,
        AsyncPipe,
        ModalComponent,
        NgIf,
        CreateModalComponent
    ],
    templateUrl: './trips.component.html',
    styleUrl: './trips.component.scss'
})
export class TripsComponent implements AfterViewInit {
    @ViewChild("main") main!: ElementRef<HTMLElement>;
    @ViewChild("tripList", { read: ElementRef }) tripList!: ElementRef<HTMLElement>;
    private tripsSubject = new BehaviorSubject<Trip[]>([]);
    trips$: Observable<Trip[]> = this.tripsSubject.asObservable();
    selectedTrip: Trip | null = null;
    createTripOpen: boolean = false;

    constructor(private service: TripsService) {
        this.service.getAllTrips().subscribe(trips => this.tripsSubject.next(trips));
    }

    ngAfterViewInit() {
        const mainRect = this.main.nativeElement.getBoundingClientRect();
        const tableStyle = window.getComputedStyle(this.tripList.nativeElement.querySelector("table")!);
        const tableBody = this.tripList.nativeElement.querySelector("tbody")!;
        const height = mainRect.bottom - parseFloat(tableStyle.margin) - tableBody.getBoundingClientRect().top;
        tableBody.style.height = `${height}px`;
    }

    updateTrip({original, updated}: { original: Trip, updated: Trip }) {
        let tripChangesSuccessful = false;
        const tripChanges = getTripChanges(original, updated);
        this.service.updateTrip(updated.id, tripChanges).subscribe({
            next: () => tripChangesSuccessful = true,
            error: (err) => alert("Failed to update trip: " + err.message),
        })
        let accessChangesSuccessful = false;
        const accessChanges = getTripAccessChanges(original, updated);
        for (const change of accessChanges) {
            this.service.addAndUpdateTripAccess(change).subscribe({
                next: () => accessChangesSuccessful = true,
                error: (err) => alert("Failed to update trip access: " + err.message),
            })
        }
        if (tripChangesSuccessful && accessChangesSuccessful) {
            const trips = this.tripsSubject.value.map(trip => trip.id === updated.id ? updated : trip);
            this.tripsSubject.next(trips);
        }
        this.closeModal()
    }

    deleteTrip(id: number) {
        this.service.deleteTrip(id).subscribe({
            next: () => {
                const trips = this.tripsSubject.value.filter(trip => trip.id !== id);
                this.tripsSubject.next(trips)
            },
            error: (err) => alert("Failed to delete trip: " + err.message),
        })
        this.closeModal()
    }

    cancelTrip(original: Trip) {
        const trips = this.tripsSubject.value.map(trip => trip.id === original.id ? original : trip);
        this.tripsSubject.next(trips);
        this.closeModal()
    }

    closeModal() {
        this.selectedTrip = null;
    }

    createTrip(trip: TripCreate) {
        this.service.createTrip(trip).subscribe({
            next: (newTrip) => {
                this.tripsSubject.next([...this.tripsSubject.value, newTrip])
            },
            error: (err) => alert("Failed to create trip: " + err.message),
        })
        this.closeCreateModal();
    }

    closeCreateModal() {
        this.createTripOpen = false;
    }

}
