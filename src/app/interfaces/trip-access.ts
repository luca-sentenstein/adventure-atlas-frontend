import { User } from './user';

export interface TripAccess {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    trip: {
        id: number;
    };
    user: User;
    accessLevel: string;
}
