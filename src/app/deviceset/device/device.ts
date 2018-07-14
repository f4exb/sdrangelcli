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

  export const DEVICE_MOCK = {
    bandwidth: 96000,
    centerFrequency: 14210000,
    hwType: "Perseus",
    index: 2,
    nbStreams: 1,
    sequence: 0,
    serial: "5257-8100b3-640040-51006e",
    state: "running",
    streamIndex: 0,
    tx: 0    
  }