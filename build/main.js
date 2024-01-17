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
var main_exports = {};
__export(main_exports, {
  SmartRaceEventReceiver: () => SmartRaceEventReceiver
});
module.exports = __toCommonJS(main_exports);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_race_event_handling = require("./lib/race-event-handling");
var import_webserver = require("@iobroker/webserver");
class SmartRaceEventReceiver extends utils.Adapter {
  server;
  api;
  constructor(options = {}) {
    super({
      ...options,
      name: "smart-race-event-receiver"
    });
    this.api = new import_race_event_handling.RaceEventHandling(this);
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("config useSsl: " + this.config.useSsl);
    this.log.info("config port: " + this.config.port);
    const requestProcessor = (req, res) => {
      if (req.method === "POST") {
        this.log.debug("Request received: " + req.url);
        let body = "";
        req.on("data", (data) => body += data);
        req.on("end", () => {
          this.log.debug("Payload: " + body);
          const payload = JSON.parse(body);
          this.api.handleRequest(payload);
        });
        res.writeHead(200);
        res.write("OK");
        res.end();
      } else {
        res.writeHead(500);
        res.write("Request error");
        res.end();
      }
    };
    const webServer = new import_webserver.WebServer({ adapter: this, app: requestProcessor, secure: this.config.useSsl });
    this.server = await webServer.init();
    this.log.info(
      "Starting server on port " + this.config.port + " and protocol " + (this.config.useSsl ? "https" : "http")
    );
    this.server.listen(this.config.port);
  }
  onUnload(callback) {
    try {
      this.log.debug("onUnload");
      if (this.server) {
        this.log.debug("closing server on port " + this.config.port);
        this.server.close();
      }
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new SmartRaceEventReceiver(options);
} else {
  (() => new SmartRaceEventReceiver())();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SmartRaceEventReceiver
});
//# sourceMappingURL=main.js.map
