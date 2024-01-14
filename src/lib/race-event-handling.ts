import { SmartRaceEventReceiver } from "../main";
import { RaceEvent, RaceEventValidator } from "./race-event-parsing";

export class RaceEventHandling {
    private adapter: SmartRaceEventReceiver;

    constructor(adapter: SmartRaceEventReceiver) {
        this.adapter = adapter;
    }

    async handleRequest(eventJson: string): Promise<void> {
        const raceEvent = await this.parseEventData(eventJson);
        const eventType = raceEvent.event_type;
        this.adapter.log.debug("Handling event " + eventType);
        const eventTime = raceEvent.time;
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
    }

    async parseEventData(eventDataJson: string): Promise<RaceEvent> {
        const raceEvent: RaceEvent = RaceEventValidator.checkValid(eventDataJson);
        return raceEvent;
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
    handleEventStart(eventTime: any, eventData: any): void {
        const raceType = eventData.type;
        this.adapter.log.info("Event start of type " + raceType);
        // TODO duration or laps
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
        await this.adapter.setStateAsync("event.lastRaceEventTimestamp", { val: eventTime, ack: true });
        await this.adapter.setStateAsync("event.raceStatus", { val: newStatus, ack: true, ts: eventTime });
    }
}
