// See https://app.quicktype.io/#
// To parse this data:
//
//   import { Convert, EventChangeStatus1, EventEnd1, EventStart1, EventStart2 } from "./file";
//
//   const eventChangeStatus1 = Convert.toEventChangeStatus1(json);
//   const eventEnd1 = Convert.toEventEnd1(json);
//   const eventStart1 = Convert.toEventStart1(json);
//   const eventStart2 = Convert.toEventStart2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface RaceEvent {
    time: number;
    event_type: string;
    event_data: EventChangeStatus | EventEnd;
}

export interface EventChangeStatus {
    old: string;
    new: string;
}

export interface EventEnd {
    type: string;
    result: { [key: string]: Result };
}

export interface Result {
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

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static async toRaceEvent(json: string): Promise<RaceEvent> {
        return cast(JSON.parse(json), r("RaceEvent"));
    }

    public static async eventRaceEventToJson(value: RaceEvent): Promise<string> {
        return JSON.stringify(uncast(value, r("RaceEvent")), null, 2);
    }

    public static toEventStart1(json: string): EventStart1 {
        return cast(JSON.parse(json), r("EventStart1"));
    }

    public static eventStart1ToJson(value: EventStart1): string {
        return JSON.stringify(uncast(value, r("EventStart1")), null, 2);
    }

    public static toEventStart2(json: string): EventStart2 {
        return cast(JSON.parse(json), r("EventStart2"));
    }

    public static eventStart2ToJson(value: EventStart2): string {
        return JSON.stringify(uncast(value, r("EventStart2")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : "";
    const keyText = key ? ` for key "${key}"` : "";
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ
                .map((a) => {
                    return prettyTypeName(a);
                })
                .join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = "", parent: any = ""): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(
            cases.map((a) => {
                return l(a);
            }),
            val,
            key,
            parent,
        );
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map((el) => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers")
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")
              ? transformArray(typ.arrayItems, val)
              : typ.hasOwnProperty("props")
                ? transformObject(getProps(typ), typ.additional, val)
                : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    RaceEvent: o(
        [
            { json: "time", js: "time", typ: 0 },
            { json: "event_type", js: "event_type", typ: "" },
            { json: "event_data", js: "event_data", typ: r("EventChangeStatus") },
        ],
        false,
    ),
    EventChangeStatus: o(
        [
            { json: "old", js: "old", typ: "" },
            { json: "new", js: "new", typ: "" },
        ],
        false,
    ),
    EventEnd: o(
        [
            { json: "type", js: "type", typ: "" },
            { json: "result", js: "result", typ: m(r("Result")) },
        ],
        false,
    ),
    Result: o(
        [
            { json: "driver_id", js: "driver_id", typ: 0 },
            { json: "car_id", js: "car_id", typ: 0 },
            { json: "controller_id", js: "controller_id", typ: 0 },
            { json: "laps", js: "laps", typ: 0 },
            { json: "best_laptime", js: "best_laptime", typ: 0 },
            { json: "pitstops", js: "pitstops", typ: 0 },
            { json: "gap", js: "gap", typ: "" },
            { json: "disqualified", js: "disqualified", typ: true },
            { json: "retired", js: "retired", typ: true },
        ],
        false,
    ),
    EventStart1: o(
        [
            { json: "time", js: "time", typ: 0 },
            { json: "event_type", js: "event_type", typ: "" },
            { json: "event_data", js: "event_data", typ: r("EventStart1EventData") },
        ],
        false,
    ),
    EventStart1EventData: o(
        [
            { json: "type", js: "type", typ: "" },
            { json: "duration", js: "duration", typ: "" },
        ],
        false,
    ),
    EventStart2: o(
        [
            { json: "time", js: "time", typ: 0 },
            { json: "event_type", js: "event_type", typ: "" },
            { json: "event_data", js: "event_data", typ: r("EventStart2EventData") },
        ],
        false,
    ),
    EventStart2EventData: o(
        [
            { json: "type", js: "type", typ: "" },
            { json: "laps", js: "laps", typ: "" },
        ],
        false,
    ),
};
