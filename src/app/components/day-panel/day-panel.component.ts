import { Component } from '@angular/core';
import { StagesManagementService } from '../../services/stages-management.service';
import { TimelineComponent } from '../timeline/timeline.component';

@Component({
  selector: 'app-day-panel',
    imports: [
        TimelineComponent
    ],
  templateUrl: './day-panel.component.html',
  styleUrl: './day-panel.component.scss'
})
export class DayPanelComponent {
    selectedDay: number | null = null;

    constructor(protected stagesService: StagesManagementService) {
        this.stagesService.selectedDay$.subscribe(day => {
            this.selectedDay = day; // Update day when selection changes
        });
    }

    deleteDay(){
        if (this.selectedDay){
            this.stagesService.deleteDay(this.selectedDay);
            this.stagesService.selectDay(null);
        }
    }
}
