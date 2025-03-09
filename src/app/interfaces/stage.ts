export interface Stage {
    title: string;
    startTime: Date | undefined;
    endTime: Date | undefined;
    day: number | undefined; //Maybe we can require at least the day to be defined? We could also assign day=0 if the stage has not been assigned to a day?
    locations: Location[];
}
