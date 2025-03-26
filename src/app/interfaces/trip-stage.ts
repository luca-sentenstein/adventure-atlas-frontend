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
    start: Date | undefined;
    end: Date | undefined;
    day: number;
    waypoints: Waypoint[];
}
