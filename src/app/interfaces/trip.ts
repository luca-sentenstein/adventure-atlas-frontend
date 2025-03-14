import { Owner } from './owner';
import { TripStage } from './trip-stage';

export interface Trip {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    owner: Owner;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    public: boolean;
    stages: TripStage[];
}
