/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import { expect } from "chai";
// import { functionToTest } from "./moduleToTest";
import { RaceEvent, RaceEventValidator } from "./lib/race-event-parsing";
import fs from "node:fs";
import { FailedValidationError } from "jointz";

describe("module to test => function to test", () => {
    // initializing logic
    const expected = 5;

    it(`should return ${expected}`, () => {
        const result = 5;
        // assign result a value from functionToTest
        expect(result).to.equal(expected);
        // or using the should() syntax
        result.should.equal(expected);
    });
    // ... more tests => it
});

describe("Race Event Parsing => parse json to object", () => {
    it(`should return thing object with event type change_status`, () => {
        const exampleJson = readExampleFile("./request/sample-requests/event.change_status_1.json");
        //const raceEvent = Convert.toRaceEvent(exampleJson);
        // assign result a value from functionToTest
        expect(exampleJson).to.exist;
        const raceEvent: RaceEvent = RaceEventValidator.checkValid(JSON.parse(exampleJson));
        expect(raceEvent).to.exist;
        expect(raceEvent).to.have.property("event_type").equals("event.change_status");
        expect(raceEvent.event_data).to.exist;
        expect(raceEvent.event_data).to.have.property("old").equals("running");
        expect(raceEvent.event_data).to.have.property("old").not.equals("");
        return;
    });
    it(`should return thing object with event type event.start`, () => {
        const exampleJson = readExampleFile("./request/sample-requests/event.start_1.json");
        //const raceEvent = Convert.toRaceEvent(exampleJson);
        // assign result a value from functionToTest
        expect(exampleJson).to.exist;

        const raceEvent: RaceEvent = RaceEventValidator.checkValid(JSON.parse(exampleJson));
        expect(raceEvent).to.exist;
        expect(raceEvent).to.have.property("event_type").equals("event.start");
        expect(raceEvent.event_data).to.exist;
        expect(raceEvent.event_data).to.have.property("duration").equals("600");
    });
    it(`should throw error if request is invalid`, () => {
        const exampleJson = readExampleFile("./request/sample-requests/invalid_request.json");
        expect(exampleJson).to.exist;
        expect(function () {
            RaceEventValidator.checkValid(JSON.parse(exampleJson));
        }).to.throw(FailedValidationError);
        //expect(RaceEventValidator.checkValid(JSON.parse(exampleJson))).to.throw(FailedValidationError);
    });
    it(`should not crash adapter if request is invalid`, () => {
        const exampleJson = readExampleFile("./request/sample-requests/invalid_request.json");
        expect(exampleJson).to.exist;
        // TODO needs an adapter mock
        //const { adapter, database } = utils.unit.createMocks({});
        //const { assertObjectExists } = utils.unit.createAsserts(database, adapter);
        //const adapterMock = sinon.spy(SmartRaceEventReceiver);

        //const reh = new RaceEventHandling(adapterMock.prototype);
        //expect(function () {
        //    reh.parseEventData(exampleJson);
        //}).to.not.throw();
    });
    // ... more tests => it
});

// ... more test suites => describe
function readExampleFile(fileName: string): string {
    return fs.readFileSync(fileName, { encoding: "utf8" });
}
