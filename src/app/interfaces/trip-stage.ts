import { Waypoint } from './waypoint';

export interface TripStage {
    id: number;
    index: number | undefined;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    displayRoute: boolean;
    cost: number;
    start: Date | undefined;  //start time
    end: Date | undefined;  //end time
    day: number;
    waypoints: Waypoint[];
}

export interface TripStageCreate {
    index: number | undefined;
    title: string;
    description: string;
    displayRoute: boolean;
    cost: number;
    start: Date | undefined;  //start time
    end: Date | undefined;  //end time
    day: number;
}
