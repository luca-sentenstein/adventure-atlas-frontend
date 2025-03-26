import { Trip } from '../interfaces/trip';

const TRIP_ATTRIBUTES_TO_CHECK = ["title", "subtitle", "description", "public", "startDate", "image"];
export type TripAccessDTO = {
    userName: string;
    trip: number;
    accessLevel: string;
};

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function getTripChanges(original: Trip, updated: Trip) {
    const changes: Partial<Trip> = {};
    for (const attribute of TRIP_ATTRIBUTES_TO_CHECK) {
        if (original.hasOwnProperty(attribute) && updated.hasOwnProperty(attribute)) {
            if (original[attribute as keyof Trip] !== updated[attribute as keyof Trip]) {
                changes[attribute as keyof Trip] = updated[attribute as keyof Trip] as any;
            }
        }
    }
    return changes;
}

export function getTripAccessChanges(original: Trip, updated: Trip) {
    const changes: TripAccessDTO[] = [];
    for (const tripAccess of original.tripAccesses) {
        const updatedAccess = updated.tripAccesses.find(value => value.id === tripAccess.id)!;
        if (tripAccess.accessLevel !== updatedAccess.accessLevel) {
            changes.push({ userName: updatedAccess.user.userName, trip: updatedAccess.trip.id, accessLevel: updatedAccess.accessLevel });
        }
    }
    return changes;
}
