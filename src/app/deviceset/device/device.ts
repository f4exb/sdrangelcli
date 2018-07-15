export interface Device {
    bandwidth: number,
    centerFrequency: number,
    hwType: string,
    index: number,
    nbStreams: number,
    sequence: number,
    state: string,
    streamIndex: number,
    tx: number    
  }

  export const DEVICE_MOCK1 = {
    bandwidth: 96000,
    centerFrequency: 14210000,
    hwType: "Perseus",
    index: 0,
    nbStreams: 1,
    sequence: 0,
    serial: "5257-8100b3-640040-51006e",
    state: "running",
    streamIndex: 0,
    tx: 0    
  }

  export const DEVICE_MOCK2 = {
    bandwidth: 600000,
    centerFrequency: 145480000,
    hwType: "BladeRF",
    index: 1,
    nbStreams: 1,
    sequence: 0,
    serial: "be03e42993b64f736d82f705f393d0c3",
    state: "running",
    streamIndex: 0,
    tx: 0    
  }

  export const DEVICE_TX_MOCK = {
    bandwidth: 112000,
    centerFrequency: 435000000,
    hwType: "HackRF",
    index: 2,
    nbStreams: 1,
    sequence: 0,
    serial: "453c64c8214d178f",
    state: "idle",
    streamIndex: 0,
    tx: 1    
  }