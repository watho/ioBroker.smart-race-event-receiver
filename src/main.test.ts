/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import { expect } from "chai";
// import { functionToTest } from "./moduleToTest";
import { Convert, RaceEvent } from "./lib/race-event-parsing";
import fs from "node:fs/promises";

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
    it(`should return object with event type change_status`, () => {
        const exampleJsonPromise = readExampleFile("./request/sample-requests/event.change_status_1.json");
        //const raceEvent = Convert.toRaceEvent(exampleJson);
        // assign result a value from functionToTest
        expect(exampleJsonPromise).to.eventually.exist;
        exampleJsonPromise.then((exampleJson) => {
            const raceEventPromise = Convert.toRaceEvent(exampleJson);
            expect(raceEventPromise).to.eventually.exist;
            expect(raceEventPromise).to.eventually.have.property("event_type").equals("event.change_status");
        });
        return;
    });
    it(`should return object with event type race_end`, () => {
        const exampleJsonPromise = readExampleFile("./request/sample-requests/event.end_1.json");
        //const raceEvent = Convert.toRaceEvent(exampleJson);
        // assign result a value from functionToTest
        expect(exampleJsonPromise).to.eventually.exist;
        exampleJsonPromise.then((exampleJson) => {
            const raceEventPromise = Convert.toRaceEvent(exampleJson);
            expect(raceEventPromise).to.eventually.exist;
            expect(raceEventPromise).to.eventually.have.property("event_type").equals("event.race_end");
        });
        return;
    });
    // ... more tests => it
});

// ... more test suites => describe
async function readExampleFile(fileName: string): Promise<string> {
    return fs.readFile(fileName, { encoding: "utf8" });
}
