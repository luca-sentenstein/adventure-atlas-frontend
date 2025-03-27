import { Injectable } from '@angular/core';
import { TripStage } from '../interfaces/trip-stage';
import { Waypoint } from '../interfaces/waypoint';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../interfaces/trip';
import { BASE_URL } from '../../constants';
import { Router } from '@angular/router';
import { TripStageCreate } from '../interfaces/trip-stage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StagesManagementService {
    private tripId: number = -1;

    private stagesSubject = new BehaviorSubject<TripStage[]>([]);

    stages$ = this.stagesSubject.asObservable();
    private tripLengthSubject = new BehaviorSubject<number>(0); // Will be set based on backend

    tripLength$ = this.tripLengthSubject.asObservable();
    private selectedStageSubject = new BehaviorSubject<TripStage | null>(null); // Track selected stage

    selectedStage$ = this.selectedStageSubject.asObservable();
    private selectedDaySubject = new BehaviorSubject<number | null>(null); // Track selected day

    selectedDay$ = this.selectedDaySubject.asObservable();
    private startDateSubject = new BehaviorSubject<Date>(new Date(0)); // Track trip start day

    startDate$ = this.startDateSubject.asObservable();
    private writeAccessSubject = new BehaviorSubject<boolean>(true);


    writeAccessSubject$ = this.writeAccessSubject.asObservable();

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    }

    resetSubjects() {
        this.stagesSubject.next([]);
        this.tripLengthSubject.next(0);
        this.selectedStageSubject.next(null);
        this.selectedDaySubject.next(null);
        this.startDateSubject.next(new Date(0));
        this.writeAccessSubject.next(true);
    }

    setTripId(id: number) {
        this.tripId = id;
        this.resetSubjects()
        this.fetchTripBackend();
    }

    getStages(): TripStage[] {
        return this.stagesSubject.value;
    }

    hasWriteAccess(): boolean {
        return this.writeAccessSubject.value;
    }

    getTripLength(): number {
        return this.tripLengthSubject.value;
    }

    getStartDate(){
        return this.startDateSubject.value;
    }

    setTripLength(length: number) {
        this.tripLengthSubject.next(length);
        this.updateTripLengthBackend(length);
    }

    getSelectedStage(){
        return this.selectedStageSubject.value;
    }

    getWaypoints(){
        return this.selectedStageSubject.value?.waypoints || [];
    }

    fetchTripBackend() {
        this.http.get<Trip>(
            BASE_URL + "/trip/" + this.tripId
        ).subscribe({
            next: trip => {
                trip.stages.sort((a, b) => <number>a.index - <number>b.index);
                trip.stages.map(stage => {
                    stage.waypoints.sort((a, b) => <number>a.index - <number>b.index);
                })
                this.stagesSubject.next(trip.stages);
                this.tripLengthSubject.next(trip.length);
                const owner = trip.owner.id === this.authService.getUser()?.id;
                const access = trip.tripAccesses?.find(access => access.user.id === this.authService.getUser()?.id);
                if (trip.public && !owner && !access) {
                    this.writeAccessSubject.next(false);
                } else {
                    this.writeAccessSubject.next(owner || access?.accessLevel === "write");
                }
                this.startDateSubject.next(trip.startDate);
            },
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip with id " + this.tripId + " not found");
                } else {
                    alert(error.message);
                }
                void this.router.navigate(["/trips"]);
            }
        })
    }


    getStagesForDay(day: number): TripStage[] {
        return this.stagesSubject.value.filter(stage => stage.day === day) || [];
    }

    addStageBackend(stage: TripStageCreate): Observable<TripStage> {
        return this.http.post<TripStage>(
            BASE_URL + "/trip/" + this.tripId + "/newStage",
            stage
        ).pipe(
            catchError(error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert(error.message);
                } else {
                    alert(error.message);
                }
                return Promise.reject(error);
            })
        )
    }

    reorderStagesBackend(ids: number[], indices: number[]) {
        for (let i = 0; i < ids.length; i++) {
            this.http.patch(
                BASE_URL + "/trip/" + this.tripId + "/stages/" + ids[i],
                {
                    index: indices[i]
                }
            ).subscribe({
                error: error => {
                    if (error.status === 401) {
                        alert("You don't have access to edit this trip.");
                    } else if (error.status === 404) {
                        alert("Trip with id " + this.tripId + " not found");
                    } else {
                        alert(error.message);
                    }
                }
            })
        }
    }

    addStage(day: number) {
        const stages = [...this.stagesSubject.value];

        let newStage: TripStageCreate = {
            index: stages.length,
            title: "New Stage",
            description: "",
            start: undefined,
            end: undefined,
            day: day,
            displayRoute: false,
            cost: 0,
            waypoints: [],
        }

        const createdStage = this.addStageBackend(newStage);


        createdStage.subscribe({
            next: stage => {
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


                stages.splice(globalNewIndex, 0, stage);

                this.reorderStagesBackend(this.getIDs(stages), this.getIndices(stages));

                this.stagesSubject.next(stages);
            }
        })

    }



    addNewDay() {
        const currentLength = this.tripLengthSubject.value;
        this.setTripLength(currentLength + 1);  // Increment tripLength
    }


    patchWaypointsBackend(stage: TripStage){
        for (let i = 0; i < stage.waypoints.length; i++) {
            stage.waypoints[i].index = i;
        }

        this.http.post(
            BASE_URL + "/trip/" + this.tripId + "/stages/" + stage.id + "/locations",
            stage.waypoints
        ).subscribe({
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip with id " + this.tripId + " not found");
                } else {
                    alert(error.message);
                }
            }
        })
    }

    addNewWaypoint(name: string | undefined, latitude: number | undefined, longitude: number | undefined) {
        const stage = this.selectedStageSubject.value;
        if (!stage) {
            console.error('No stage selected, cannot add waypoint.');
            return;
        }

        if(name === undefined || longitude === undefined || latitude === undefined){
            console.error("Waypoint invalid!");
            return;
        }

        const waypoint: Waypoint = {
            id: undefined, //Placeholder,
            index: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            name: name,
            lat: latitude, //Todo: Should be invalid if the location has no lat or lng
            lng: longitude,
        };

        stage.waypoints.push(waypoint);

        this.patchWaypointsBackend(stage);

        this.updateStage(stage);
    }


    reorderWaypoints(previousIndex: number, currentIndex: number) {
        const stage = this.selectedStageSubject.value;
        if (!stage) {
            console.error('No stage selected, cannot reorder waypoints.');
            return;
        }

        const waypoints = [...stage.waypoints]; // Create a copy to avoid mutating the original directly
        const [movedWaypoint] = waypoints.splice(previousIndex, 1); // Remove the moved waypoint
        waypoints.splice(currentIndex, 0, movedWaypoint); // Insert it at the new position

        // Create a new stage with the reordered waypoints
        const updatedStage = {
            ...stage,
            waypoints: waypoints
        };



        this.patchWaypointsBackend(updatedStage);

        this.updateStage(updatedStage);
    }



    deleteWaypoint(index: number){
        const stage = this.selectedStageSubject.value;
        if (!stage) {
            console.error('No stage selected, cannot delete waypoint.');
            return;
        }

        stage.waypoints.splice(index, 1); // Remove the waypoint
        this.updateStage(stage);


        this.patchWaypointsBackend(stage);
    }


    updateWaypoint(index: number, name: string, latitude: number, longitude: number) {
        const stage = this.selectedStageSubject.value;
        if (!stage) {
            console.error('No stage selected, cannot update waypoint.');
            return;
        }

        stage.waypoints[index].name = name;
        stage.waypoints[index].lat = latitude;
        stage.waypoints[index].lng = longitude;

        this.updateStage(stage);


        this.patchWaypointsBackend(stage);
    }


    updateStageDayBackend(stageID: number, newDay: number){
        this.http.patch(
            BASE_URL + "/trip/" + this.tripId + "/stages/" + stageID,
            {
                day: newDay,
            }
        ).subscribe({
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip with id " + this.tripId + " not found");
                } else {
                    alert(error.message);
                }
            }
        })
    }

    reorderStage(movedStage: TripStage, newDay: number, newIndex: number) {
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


        this.updateStageDayBackend(movedStage.id, movedStage.day);
        this.reorderStagesBackend(this.getIDs(stages), this.getIndices(stages));

        // Emit the updated array
        this.stagesSubject.next(stages);
    }

    selectStage(stageId: number | null) {
        const stages = this.stagesSubject.value;
        const stage = stageId !== null ? stages.find(s => s.id === stageId) || null : null;
        this.selectedStageSubject.next(stage); // Update selected stage based on id
    }

    selectDay(day: number | null) {
        this.selectedDaySubject.next(day);
    }

    getSelectedStageId(): number | null {
        return this.selectedStageSubject.value?.id || null;
    }

    getSelectedDay(): number | null {
        return this.selectedDaySubject.value;
    }

    updateStages(newStages: TripStage[]) {
        this.stagesSubject.next(newStages);
        const currentSelectedId = this.getSelectedStageId();
        if (currentSelectedId !== null) {
            this.selectStage(currentSelectedId); // Reselect to update reference
        }
    }


    //For edit section (maybe with timer?)
    updateStageBackend(updatedStage: TripStage) {
        this.http.patch(
            BASE_URL + "/trip/" + this.tripId + "/stages/" + updatedStage.id,
            {
                title: updatedStage.title,
                description: updatedStage.description,
                start: updatedStage.start,
                end: updatedStage.end,
                cost: updatedStage.cost ? updatedStage.cost : 0,
                displayRoute: updatedStage.displayRoute
            }
        ).subscribe({
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip with id " + this.tripId + " not found");
                } else {
                    alert(error.message);
                }
            }
        })
    }

    updateStage(updatedStage: TripStage) {
        const stages = [...this.stagesSubject.value];
        const index = stages.findIndex(s => s.id === updatedStage.id);
        if (index !== -1) {
            // Inline the deep copy directly into the assignment
            stages[index] = {
                ...updatedStage,
                waypoints: [...updatedStage.waypoints]
            };
            this.updateStages(stages);
        }
    }

    deleteStageBackend(stageID: number){
        this.http.delete(
            BASE_URL + "/trip/" + this.tripId + "/stages/" + stageID,
        ).subscribe({
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip or stage not found");
                } else {
                    alert(error.message);
                }
            }
        })
    }

    deleteStage(stage: TripStage){
        const stages = [...this.stagesSubject.value];
        const index = stages.findIndex(s => s.id === stage.id);
        if (index !== -1) {
            stages.splice(index, 1);

            this.deleteStageBackend(stage.id);
            this.reorderStagesBackend(this.getIDs(stages), this.getIndices(stages));

            this.updateStages(stages);
        }
    }

    updateTripLengthBackend(length: number) {
        this.http.patch(
            BASE_URL + "/trip/" + this.tripId,
            {
                length: length
            }
        ).subscribe({
            error: error => {
                if (error.status === 401) {
                    alert("You don't have access to edit this trip.");
                } else if (error.status === 404) {
                    alert("Trip with id " + this.tripId + " not found");
                } else {
                    alert(error.message);
                }
            }
        })
    }


    deleteDay(day: number){
        const stages = [...this.stagesSubject.value];


        //Delete all stages with that day
        for(let i = stages.length - 1; i >= 0; i--){
            if(stages[i].day == day){
                this.deleteStageBackend(stages[i].id);
                stages.splice(i, 1);
            }
        }

        //Decrement the day attribute of all the other stages
        for(let i = stages.length - 1; i >= 0; i--){
            if(stages[i].day > day){
                stages[i].day -= 1;
                this.updateStageDayBackend(stages[i].id, stages[i].day);
            }
        }

        this.updateStages(stages);

        const tripLength = this.getTripLength() - 1;
        this.setTripLength(tripLength);
    }

    getIDs(list: TripStage[]): number[] {
        let IDs: number[] = [];
        for (const object of list) {
            IDs.push(object.id);
        }

        return IDs;
    }

    getIndices(list: any[]): number[]{
        return [...Array(list.length).keys()];
    }
}
