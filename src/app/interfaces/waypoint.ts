export interface Waypoint {
    id: number;
    index: number | undefined;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    lat: number;
    long: number;
}
