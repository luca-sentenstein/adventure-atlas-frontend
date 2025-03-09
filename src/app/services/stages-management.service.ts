import { Injectable } from '@angular/core';
import { Stage } from '../interfaces/stage';
import { Location } from '../interfaces/location';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StagesManagementService {
    private stagesSubject = new BehaviorSubject<Stage[]>([
        { title: 'Item 1', startTime: new Date(), endTime: new Date(), day: 1, locations: [] },
        { title: 'Item 2', startTime: undefined, endTime: undefined, day: 1, locations: [] },
        { title: 'Item 3', startTime: undefined, endTime: undefined, day: 2, locations: [] },
        { title: 'Item 4', startTime: new Date(), endTime: undefined, day: 3, locations: [] },
    ]);
    stages$ = this.stagesSubject.asObservable();

    private tripLengthSubject = new BehaviorSubject<number>(3); // Will be set based on backend
    tripLength$ = this.tripLengthSubject.asObservable();

    getStages(): Stage[] {
        return this.stagesSubject.value;
    }

    getTripLength(): number {
        return this.tripLengthSubject.value;
    }

    setTripLength(length: number) {
        this.tripLengthSubject.next(length);
    }


    // Placeholder for backend fetch (to be implemented later)
    fetchTripLengthFromBackend(): Promise<number> {
        // Simulate backend call (replace with actual API call)
        return new Promise(resolve => {
            setTimeout(() => resolve(5), 1000); // Example: returns 5 days
        });
    }

    //getUniqueDays(): number[] {
    //    const days = new Set<number>();
    //    this.stagesSubject.value.forEach(stage => {
    //        if (stage.day !== undefined) //Because stage.day can be undefined, we have to filter out these values
    //        {
    //            days.add(stage.day);
    //        }
    //    });
    //    return Array.from(days);
    //}

    getStagesForDay(day: number): Stage[] {
        return this.stagesSubject.value.filter(stage => stage.day === day) || [];
    }

    addStage(day: number) {
        const stages = [...this.stagesSubject.value];

        const newStage: Stage = {
            title: `New Stage (Day ${day})`,
            startTime: undefined,
            endTime: undefined,
            day: day,
            locations: []
        };

        // Find the starting index of the target day
        let targetDayStartIndex = 0;
        while (targetDayStartIndex < stages.length) {
            if (stages[targetDayStartIndex].day === day) {
                break;
            }
            targetDayStartIndex++;
        }
        // If no stage with targetDay is found, append to the end
        if (targetDayStartIndex === stages.length) {
            targetDayStartIndex = stages.length;
        }

        // Insert the new stage at the end of the target day's block
        const targetDayLength = stages.filter(s => s.day === day).length;
        const globalNewIndex = targetDayStartIndex + targetDayLength;

        stages.splice(globalNewIndex, 0, newStage);
        this.stagesSubject.next(stages);
    }

    addNewDay() {
        const currentLength = this.tripLengthSubject.value;
        this.tripLengthSubject.next(currentLength + 1); // Increment tripLength
    }


    reorderStage(movedStage: Stage, newDay: number, newIndex: number) {
        const stages = [...this.stagesSubject.value]; // Create a copy to modify
        const previousDay = movedStage.day;
        if (previousDay === undefined) {
            console.warn('Previous day is undefined, cannot determine source list.');
            return;
        }

        // Find the current index of the moved stage in the stages array
        const currentIndex = stages.indexOf(movedStage);
        if (currentIndex === -1) {
            console.warn('Moved stage not found in stages array.');
            return;
        }

        // Remove the stage from its current position
        stages.splice(currentIndex, 1);

        // Update the day of the moved stage
        movedStage.day = newDay;

        //Get index of the first element with the target day
        let indexOfDay: number = 0
        while(indexOfDay < stages.length){
            if (stages[indexOfDay].day == newDay){
                break;
            }
            indexOfDay++;
        }

        let globalNewIndex: number = indexOfDay + newIndex;


        // Insert the stage at the new position
        stages.splice(globalNewIndex, 0, movedStage);

        // Emit the updated array
        this.stagesSubject.next(stages);
    }
}
