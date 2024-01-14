import jointz, { Infer } from "jointz";

const ThingValidator = jointz
    .object({
        id: jointz.string().uuid(),
        name: jointz.string().minLength(3).maxLength(100),
    })
    .requiredKeys(["id", "name"]);

type Thing = Infer<typeof ThingValidator>;

const myObject: unknown = { id: "abc", name: "hello world!" };

try {
    const thing: Thing = ThingValidator.checkValid(myObject);
} catch (validationError: any) {
    console.log(validationError.errors);
}

export const RaceEventValidator = jointz
    .object({
        time: jointz.number(),
        event_type: jointz.string(),
        event_data: jointz.or(
            // event.change_status
            jointz
                .object({
                    old: jointz.string(),
                    new: jointz.string(),
                })
                .requiredKeys(["old", "new"]),
            // event.start
            jointz
                .object({
                    type: jointz.string(),
                    duration: jointz.string(),
                    laps: jointz.string(),
                })
                .requiredKeys(["type"]),
            // event.end
            jointz.object({}),
        ),
    })
    .requiredKeys(["time", "event_type", "event_data"]);

export type RaceEvent = Infer<typeof RaceEventValidator>;

export interface IRaceEvent {
    time: number;
    event_type: string;
    event_data: IEventChangeStatus;
}

/**
 * @serializable
 */
export interface IEventChangeStatus {
    old: string;
    new: string;
}

/**
 * @serializable
 */
export interface EventEnd {
    type: string;
    result: { [key: string]: RaceResult };
}

/**
 * @serializable
 */
export interface RaceResult {
    driver_id: number;
    car_id: number;
    controller_id: number;
    laps: number;
    best_laptime: number;
    pitstops: number;
    gap: string;
    disqualified: boolean;
    retired: boolean;
}

export interface EventStart1 {
    time: number;
    event_type: string;
    event_data: EventStart1EventData;
}

export interface EventStart1EventData {
    type: string;
    duration: string;
}

export interface EventStart2 {
    time: number;
    event_type: string;
    event_data: EventStart2EventData;
}

export interface EventStart2EventData {
    type: string;
    laps: string;
}
