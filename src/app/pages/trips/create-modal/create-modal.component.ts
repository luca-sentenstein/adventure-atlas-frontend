import { Component, EventEmitter, Output } from '@angular/core';
import { TripCreate } from '../../../interfaces/trip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../modal/text-input/text-input.component';

@Component({
  selector: 'app-create-modal',
    imports: [
        ReactiveFormsModule,
        TextInputComponent,
        FormsModule,
    ],
  templateUrl: './create-modal.component.html',
  styleUrl: './create-modal.component.scss'
})
export class CreateModalComponent {
    @Output() createTrip: EventEmitter<TripCreate> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();
    trip: TripCreate = {
        title: "",
        subtitle: "",
        description: "",
        public: false,
        startDate: new Date(),
        stages: [],
        length: 0
    };
}
