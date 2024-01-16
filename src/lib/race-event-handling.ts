import { SmartRaceEventReceiver } from "../main";
import { RaceEvent, RaceEventValidator } from "./race-event-parsing";
import { FailedValidationError } from "jointz";

export class RaceEventHandling {
    private adapter: SmartRaceEventReceiver;

    constructor(adapter: SmartRaceEventReceiver) {
        this.adapter = adapter;
    }

    async handleRequest(eventJson: string): Promise<void> {
        try {
            const raceEvent: RaceEvent = await this.parseEventData(eventJson);
            const eventType = raceEvent.event_type;
            this.adapter.log.debug("Handling event " + eventType);
            const eventTime = raceEvent.time;
            await this.adapter.setStateAsync("event.name", { val: eventType, ack: true, ts: eventTime });
            await this.adapter.setStateAsync("event.timestamp", { val: eventTime, ack: true, ts: eventTime });
            const eventData = raceEvent.event_data;

            switch (eventType) {
                case "event.start":
                    this.handleEventStart(eventTime, eventData);
                    break;
                case "event.end":
                    this.handleEventEnd(eventTime, eventData);
                    break;
                case "event.change_status":
                    await this.handleEventChangeStatus(eventTime, eventData);
                    break;
                default:
                    this.adapter.log.warn("Invalid or unimplemented event type received: " + eventType);
            }
        } catch (validationError: any) {
            if (validationError instanceof FailedValidationError) {
                this.adapter.log.error("Received invalid or unknown event: " + JSON.stringify(validationError.errors));
            } else {
                this.adapter.log.error("Error parsing received json: " + JSON.stringify(validationError));
            }
        }
    }

    async parseEventData(eventDataJson: string): Promise<RaceEvent> {
        return RaceEventValidator.checkValid(eventDataJson);
    }

    /**
     * {
     *     "type": "race",
     *     "laps": "50"
     * }
     *
     * @param eventTime
     * @param eventData
     */
    async handleEventStart(eventTime: any, eventData: any): Promise<void> {
        const raceType = eventData.type;
        const duration = eventData.duration;
        const laps = eventData.laps;
        this.adapter.log.info("Event start of type " + raceType);
        await this.adapter.setStateAsync("event.start.type", { val: raceType, ack: true, ts: eventTime });
        if (duration) {
            await this.adapter.setStateAsync("event.start.duration", { val: duration, ack: true, ts: eventTime });
            await this.adapter.delStateAsync("event.start.laps");
        }
        if (laps) {
            await this.adapter.setStateAsync("event.start.laps", { val: laps, ack: true, ts: eventTime });
            await this.adapter.delStateAsync("event.start.duration");
        }
        this.adapter.log.info("duration " + (await this.adapter.getStateAsync("event.start.duration")));
        this.adapter.log.info("laps " + (await this.adapter.getStateAsync("event.start.laps")));
    }

    handleEventEnd(eventTime: any, eventData: any): void {
        const raceType = eventData.type;
        this.adapter.log.info("Event end of type " + raceType);
    }

    /**
     * {
     *     "old": "running",
     *     "new": "ended"
     * }
     *
     * Valid status names: prepare_for_start, starting, jumpstart, running, suspended, restarting, ended
     *
     * @param eventTime
     * @param eventData
     */
    async handleEventChangeStatus(eventTime: any, eventData: any): Promise<void> {
        const oldStatus = eventData.old;
        const newStatus = eventData.new;
        this.adapter.log.info("Change race status from " + oldStatus + " to " + newStatus);
        await this.adapter.setStateAsync("event.change_status.old", { val: oldStatus, ack: true, ts: eventTime });
        await this.adapter.setStateAsync("event.change_status.new", { val: newStatus, ack: true, ts: eventTime });
    }
}
