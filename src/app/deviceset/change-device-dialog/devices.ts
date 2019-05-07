export interface AvailableDevice {
    displayedName: string;
    hwType: string;
    serial: string;
    sequence: number;
    direction: number;
    deviceNbStreams: number;
    deviceStreamIndex: number;
    deviceSetIndex: number;
    index: number;
}

export interface AvailableDevices {
    devicecount: number;
    devices: AvailableDevice[];
}

export interface NewDevice {
  hwType: string;
  serial?: string;
  sequence?: number;
  direction: number;
}

export const AVAILABLE_DEVICES_MOCK = {
    devicecount: 7,
    devices: [
      {
        deviceSetIndex: -1,
        displayedName: 'AirspyHF[0] c852a98040c73f93',
        hwType: 'AirspyHF',
        index: 0,
        deviceNbStreams: 1,
        sequence: 0,
        serial: 'c852a98040c73f93',
        direction: 0
      },
      {
        deviceSetIndex: 0,
        displayedName: 'BladeRF1[0] be03e42993b64f736d82f705f393d0c3',
        hwType: 'BladeRF1',
        index: 1,
        deviceNbStreams: 1,
        sequence: 0,
        serial: 'be03e42993b64f736d82f705f393d0c3',
        direction: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: 'FileSource',
        hwType: 'FileSource',
        index: 2,
        deviceNbStreams: 1,
        sequence: 0,
        direction: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: 'LimeSDR[0:0] 1D3AC6E32E7C66',
        hwType: 'LimeSDR',
        index: 3,
        deviceNbStreams: 1,
        sequence: 0,
        serial: 'LimeSDR Mini, media=USB 3.0, module=FT601, addr=24607:1027, serial=1D3AC6E32E7C66',
        direction: 0
      },
      {
        deviceSetIndex: 2,
        displayedName: 'Perseus[0] 5257-8100b3-640040-51006e',
        hwType: 'Perseus',
        index: 4,
        deviceNbStreams: 1,
        sequence: 0,
        serial: '5257-8100b3-640040-51006e',
        direction: 0
      },
      {
        deviceSetIndex: 1,
        displayedName: 'SDRdaemonSource',
        hwType: 'SDRdaemonSource',
        index: 5,
        deviceNbStreams: 1,
        sequence: 0,
        direction: 0
      },
      {
        deviceSetIndex: -1,
        displayedName: 'TestSource',
        hwType: 'TestSource',
        index: 6,
        deviceNbStreams: 1,
        sequence: 0,
        direction: 0
      }
    ]
};
