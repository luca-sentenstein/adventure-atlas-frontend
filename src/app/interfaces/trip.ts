import { User } from './user';
import { TripAccess } from './trip-access';
import { TripStage } from './trip-stage';

export interface Trip {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    title: string;
    subtitle: string;
    description: string;
    image: string | ArrayBuffer | null | undefined;
    public: boolean;
    startDate: Date;
    stages: TripStage[];
    tripAccesses: TripAccess[];
    length: number;
}

export interface TripCreate {
    title: string;
    subtitle: string;
    description: string;
    public: boolean;
    startDate: Date;
    stages: TripStage[];
    length: number
}
