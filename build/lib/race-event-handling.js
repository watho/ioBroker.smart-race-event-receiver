"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var race_event_handling_exports = {};
__export(race_event_handling_exports, {
  RaceEventHandling: () => RaceEventHandling
});
module.exports = __toCommonJS(race_event_handling_exports);
var import_race_event_parsing = require("./race-event-parsing");
var import_jointz = require("jointz");
class RaceEventHandling {
  adapter;
  constructor(adapter) {
    this.adapter = adapter;
  }
  async handleRequest(eventJson) {
    try {
      const raceEvent = await this.parseEventData(eventJson);
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
    } catch (validationError) {
      if (validationError instanceof import_jointz.FailedValidationError) {
        this.adapter.log.error("Received invalid or unknown event: " + JSON.stringify(validationError.errors));
      } else {
        this.adapter.log.error("Error parsing received json: " + JSON.stringify(validationError));
      }
    }
  }
  async parseEventData(eventDataJson) {
    return import_race_event_parsing.RaceEventValidator.checkValid(eventDataJson);
  }
  async handleEventStart(eventTime, eventData) {
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
    this.adapter.log.info("duration " + await this.adapter.getStateAsync("event.start.duration"));
    this.adapter.log.info("laps " + await this.adapter.getStateAsync("event.start.laps"));
  }
  handleEventEnd(eventTime, eventData) {
    const raceType = eventData.type;
    this.adapter.log.info("Event end of type " + raceType);
  }
  async handleEventChangeStatus(eventTime, eventData) {
    const oldStatus = eventData.old;
    const newStatus = eventData.new;
    this.adapter.log.info("Change race status from " + oldStatus + " to " + newStatus);
    await this.adapter.setStateAsync("event.change_status.old", { val: oldStatus, ack: true, ts: eventTime });
    await this.adapter.setStateAsync("event.change_status.new", { val: newStatus, ack: true, ts: eventTime });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RaceEventHandling
});
//# sourceMappingURL=race-event-handling.js.map
