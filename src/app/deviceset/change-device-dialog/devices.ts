export interface AvailableDevice {
    displayedName: string,
    hwType: string,
    serial: string,
    sequence: number,
    tx: number,
    nbStreams: number,
    streamIndex: number,
    deviceSetIndex: number,
    index: number
}

export interface AvailableDevices {
    devicecount: number,
    devices: AvailableDevice
}

export const AVAILABLE_DEVICES_MOCK = {
    devicecount: 7,
    devices: [
      {
        deviceSetIndex: -1,
        displayedName: "AirspyHF[0] c852a98040c73f93",
        hwType: "AirspyHF",
        index: 0,
        nbStreams: 1,
        sequence: 0,
        serial: "c852a98040c73f93",
        tx: 0
      },
      {
        deviceSetIndex: 0,
        displayedName: "BladeRF[0] be03e42993b64f736d82f705f393d0c3",
        hwType: "BladeRF",
        index: 1,
        nbStreams: 1,
        sequence: 0,
        serial: "be03e42993b64f736d82f705f393d0c3",
        tx: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: "FileSource",
        hwType: "FileSource",
        index: 2,
        nbStreams: 1,
        sequence: 0,
        tx: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: "LimeSDR[0:0] 1D3AC6E32E7C66",
        hwType: "LimeSDR",
        index: 3,
        nbStreams: 1,
        sequence: 0,
        serial: "LimeSDR Mini, media=USB 3.0, module=FT601, addr=24607:1027, serial=1D3AC6E32E7C66",
        tx: 0
      },
      {
        deviceSetIndex: 2,
        displayedName: "Perseus[0] 5257-8100b3-640040-51006e",
        hwType: "Perseus",
        index: 4,
        nbStreams: 1,
        sequence: 0,
        serial: "5257-8100b3-640040-51006e",
        tx: 0
      },
      {
        deviceSetIndex: 1,
        displayedName: "SDRdaemonSource",
        hwType: "SDRdaemonSource",
        index: 5,
        nbStreams: 1,
        sequence: 0,
        tx: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: "TestSource",
        hwType: "TestSource",
        index: 6,
        nbStreams: 1,
        sequence: 0,
        tx: 0
      }
    ]
}