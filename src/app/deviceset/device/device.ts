export interface Device {
    bandwidth: number;
    centerFrequency: number;
    hwType: string;
    index: number;
    deviceNbStreams: number;
    sequence: number;
    serial?: string;
    state: string;
    deviceStreamIndex: number;
    direction: number;
  }

  export const DEVICE_MOCK1 = {
    bandwidth: 96000,
    centerFrequency: 14210000,
    hwType: 'Perseus',
    index: 0,
    deviceNbStreams: 1,
    sequence: 0,
    serial: '5257-8100b3-640040-51006e',
    state: 'running',
    deviceStreamIndex: 0,
    direction: 0
  };

  export const DEVICE_MOCK2 = {
    bandwidth: 600000,
    centerFrequency: 145480000,
    hwType: 'BladeRF1',
    index: 1,
    deviceNbStreams: 1,
    sequence: 0,
    serial: 'be03e42993b64f736d82f705f393d0c3',
    state: 'running',
    deviceStreamIndex: 0,
    direction: 0
  };

  export const DEVICE_TX_MOCK = {
    bandwidth: 112000,
    centerFrequency: 435000000,
    hwType: 'HackRF',
    index: 2,
    deviceNbStreams: 1,
    sequence: 0,
    serial: '453c64c8214d178f',
    state: 'idle',
    deviceStreamIndex: 0,
    direction: 1
  };
