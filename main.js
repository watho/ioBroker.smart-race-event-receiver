"use strict";

/*
 * Created with @iobroker/create-adapter v2.5.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");

class SmartRaceEventReceiver extends utils.Adapter {

	/**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
	constructor(options) {
		super({
			...options,
			name: "smart-race-event-receiver",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
     * Is called when databases are connected and adapter received configuration.
     */
	async onReady() {
		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config port: " + this.config.port);
		// Initialize your adapter here
		this.server = await this.initWebServer(this.config.port);

		/*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
		// await this.setObjectNotExistsAsync("event", {
		// 	type: "channel",
		// 	common: {
		// 		name: "event",
		// 		type: "string",
		// 		read: true,
		// 		write: false,
		// 	},
		// 	native: {},
		// });
		// await this.setObjectNotExistsAsync("event.raceStatus", {
		// 	type: "state",
		// 	common: {
		// 		name: "raceStatus",
		// 		type: "string",
		// 		role: "state",
		// 		read: true,
		// 		write: false,
		// 	},
		// 	native: {},
		// });

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		//this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
		// the variable testVariable is set to true as command (ack=false)
		//await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync("testVariable", {val: true, ack: true});

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync("testVariable", {val: true, ack: true, expire: 30});

		// examples for the checkPassword/checkGroup functions
		//let result = await this.checkPasswordAsync("admin", "iobroker");
		//this.log.info("check user admin pw iobroker: " + result);

		//result = await this.checkGroupAsync("admin", "admin");
		//this.log.info("check group user admin group admin: " + result);
	}

	/**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			this.log.debug("onUnload");
			if (this.server && this.server.server){
				this.log.debug("closing server on port " + this.port);
				this.server.server.close();
			}
			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }


	async initWebServer(port) {

		const server = {
			server: null,
			port: port
		};

		const requestProcessor = (req, res) => {
			if (req.method === "POST") {
				//this.log.info("Buh");
				//this.log.debug("Received request: " + req.url);
				// var parsedUrl = url.parse(req.url, true);
				// var reqData = parsedUrl.query;
				//
				// adapter.log.debug("Analyzed request data: " + JSON.stringify(reqData));
				// var user = parsedUrl.pathname.slice(1);
				this.log.debug("Request received: " + req.url);
				//const reqData = JSON.stringify(req.data);
				//this.log.debug("Payload: " + reqData);

				let body = "";
				// retrieving and appending post data
				req.on("data", data => body += data);
				// end of data
				req.on("end", () => {
					this.log.debug("Payload: " + body);
					const payload = JSON.parse(body);
					this.handleRequest(payload);
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

		if (port) {
			server.server = require("http").createServer(requestProcessor);
			server.server.__server = server;
		} else {
			this.log.error("Port missing");
			process.exit(1);
		}

		server.server.on("error", (e) => {
			if (e.code === "EADDRINUSE") {
				console.log("Address in use, retrying...");
				setTimeout(() => {
					server.server.close();
					server.server.listen(port);
				}, 1000);
			}
		});

		if (server.server) {
			this.log.info("Starting server listening on port " + port);
			server.server.listen(port);
			this.log.info("HTTP server is listening on port " + port);
		}


		if (server.server) {
			return server;
		} else {
			return null;
		}
	}


	/**
	 * {
	 *   "time": 1684769957969, // Time of the event as Unix timestamp
	 *   "event_type": "ui.lap_update", // Event name
	 *   "event_data": {
	 *       // The data of the event, see below
	 *   }
	 * }
	 * @param event
	 */
	async handleRequest(event){

		const eventType = event.event_type;
		this.log.debug("Handling event " + eventType);
		const eventTime = event.time;
		const eventData = event.event_data;

		switch(eventType) {
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
				this.log.warn("Invalid or unimplemented event type received: " + eventType);
		}

	}

	/**
	 * {
	 *     "type": "race",
	 *     "laps": "50"
	 * }
	 *
	 * @param event
	 */
	handleEventStart(eventTime, eventData){
		const raceType = eventData.type;
		this.log.info("Event start of type " + raceType);
		// TODO duration or laps
	}

	handleEventEnd(eventTime, eventData) {
		const raceType = eventData.type;
		this.log.info("Event end of type " + raceType);
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
	async handleEventChangeStatus(eventTime, eventData) {
		const oldStatus = eventData.old;
		const newStatus = eventData.new;
		this.log.info("Change Racestatus from " + oldStatus + " to " + newStatus);
		await this.setStateAsync("event.lastRaceEventTimestamp", {val: eventTime, ack: true});
		await this.setStateAsync("event.raceStatus", {val: newStatus, ack: true, ts: eventTime});
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
	module.exports = (options) => new SmartRaceEventReceiver(options);
} else {
	// otherwise start the instance directly
	new SmartRaceEventReceiver();
}
