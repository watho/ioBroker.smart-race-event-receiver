![Logo](admin/smart-race-event-receiver.png)

# ioBroker.smart-race-event-receiver

[![NPM version](https://img.shields.io/npm/v/iobroker.smart-race-event-receiver.svg)](https://www.npmjs.com/package/iobroker.smart-race-event-receiver)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smart-race-event-receiver.svg)](https://www.npmjs.com/package/iobroker.smart-race-event-receiver)
![Number of Installations](https://iobroker.live/badges/smart-race-event-receiver-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/smart-race-event-receiver-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.smart-race-event-receiver.png?downloads=true)](https://nodei.co/npm/iobroker.smart-race-event-receiver/)

**Tests:
** ![Test and Release](https://github.com/watho/ioBroker.smart-race-event-receiver/workflows/Test%20and%20Release/badge.svg)

## smart-race-event-receiver adapter for ioBroker

This Adapter receives events from the smartrace app for slotcar racing. See [smartrace.de](https://www.smartrace.de/en/)
and [buy them a coffee](https://www.smartrace.de/en/buy-me-a-coffee/).
The adapter uses the [data interface](https://www.smartrace.de/en/the-smartrace-manual/data-interface/) which is a paid
feature, so if you don't have a slotcar racetrack and don't use the
smartrace app or don't want to pay for the data interface then this adapter is not for you.

## Disclaimer

Despite having decades of experience in web development this is my first ioBroker-Adapter and my first experiences with
typescript and npm. Due to the nature of the data interface I can't break anything on your slotcar track or in the
smartrace-app, and I am pretty confident that this will also not happen with your ioBroker installation.

I am not working for or having any relation to [smartrace.de](https://www.smartrace.de/en/). I am just a satisfied
customer who likes to share his work on integrating slotcar racing into home automation.

## Usage

- Enable data interface in smartrace app.
- Enter your ioBroker-url + port as configured (default 8085) in smart race app.
- Look at folder `smart-race-event-receiver.0.event.change_status` for the previous and current race status, e.g.
  running, ended.

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
### 0.0.2-alpha.1 (2024-01-16)

* Restructured `event.change_status`.
* Added handling of `event.start`.

### 0.0.2-alpha.0 (2024-01-14)

* initial release
* Creates webserver as receiving endpoint for the data interface.
* Usage of ssl and port configurable.
* Receives race status changed events and shows them in ioBroker objects.

## Event Implementation Status

| Event name            | Description             | Status |
|-----------------------|-------------------------|--------|
| `event.change_status` | Changes in race status. | yes    |
| `event.start`         | Race started.           | yes    |
| `event.end`           | Race ended.             | wip    |
| more to come          |                         |        |

## License

MIT License

Copyright (c) 2024 watho <watho@users.noreply.github.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.