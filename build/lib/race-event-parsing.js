"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var race_event_parsing_exports = {};
__export(race_event_parsing_exports, {
  RaceEventValidator: () => RaceEventValidator
});
module.exports = __toCommonJS(race_event_parsing_exports);
var import_jointz = __toESM(require("jointz"));
const RaceEventValidator = import_jointz.default.object({
  time: import_jointz.default.number(),
  event_type: import_jointz.default.string(),
  event_data: import_jointz.default.or(
    import_jointz.default.object({
      old: import_jointz.default.string(),
      new: import_jointz.default.string()
    }).requiredKeys(["old", "new"]),
    import_jointz.default.object({
      type: import_jointz.default.string(),
      duration: import_jointz.default.string(),
      laps: import_jointz.default.string()
    }).requiredKeys(["type"]),
    import_jointz.default.object({})
  )
}).requiredKeys(["time", "event_type", "event_data"]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RaceEventValidator
});
//# sourceMappingURL=race-event-parsing.js.map
