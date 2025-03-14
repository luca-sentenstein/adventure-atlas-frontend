import { StageLocation } from './stage-location';

export interface TripStage {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    picture?: string;
    description: string;
    displayRoute: boolean;
    cost: number;
    start: Date;
    end: Date;
    locations: StageLocation[];
}
