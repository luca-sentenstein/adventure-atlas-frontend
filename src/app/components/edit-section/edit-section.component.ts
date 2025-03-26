import { Component } from '@angular/core';
import { TripStage } from '../../interfaces/trip-stage';
import { StagesManagementService } from '../../services/stages-management.service';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-section',
    imports: [
        DatePipe,
        FormsModule,
        NgIf,
    ],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss'
})
export class EditSectionComponent {
    stage: TripStage | null = null;



    constructor(protected stagesService: StagesManagementService) {
        this.stagesService.selectedStage$.subscribe(stage => {
            this.stage = stage; // Update stage when selection changes
        });
    }



    updateStage() {
        if (this.stage) {
            this.stagesService.updateStage(this.stage);
            this.stagesService.updateStageBackend(this.stage);
        }
    }

    updateTime(field: 'start' | 'end', event: Event) {
        if (!this.stage) return;
        const input = event.target as HTMLInputElement;
        const timeValue = input.value; // Format: "HH:mm"
        if (timeValue) {
            const [hours, minutes] = timeValue.split(':').map(Number);
            const date = this.stage[field] instanceof Date ? new Date(this.stage[field]!) : new Date();
            date.setHours(hours, minutes, 0, 0);
            this.stage[field] = date;
            this.updateStage();
        } else {
            this.stage[field] = undefined;
            this.updateStage();
        }
    }

    protected deleteStage() {
        if (this.stage) {
            this.stagesService.deleteStage(this.stage);
        }
    }
}
