export interface Waypoint {
    id: number | undefined;
    index: number | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    name: string;
    lat: number;
    lng: number;
}
