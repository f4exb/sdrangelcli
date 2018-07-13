import { DeviceSet } from "../../deviceset/deviceset/deviceset";

export interface InstanceSummary {
    appname: string,
    architecture: string,
    dspRxBits: number,
    dspTxBits: number,
    os: string,
    pid: number,
    qtVersion: string,
    version: string,
    devicesetlist: {
        devicesetcount: number,
        devicesetfocus?: number,
        deviceSets?: [DeviceSet]
    },
    logging: {
        consoleLevel: string,
        dumpToFile: number,
        fileLevel?: string,
        fileName?: string
    }    
  }

  export const INSTANCE_SUMMARY_MOCK = {
    appname: "SDRangel",
    architecture: "x86_64",
    devicesetlist: {
      deviceSets: [
        {
          channelcount: 0,
          samplingDevice: {
            bandwidth: 0,
            centerFrequency: 0,
            hwType: "FileSource",
            index: 0,
            nbStreams: 1,
            sequence: 0,
            state: "idle",
            streamIndex: 0,
            tx: 0
          }
        }
      ],
      devicesetcount: 1,
      devicesetfocus: 0
    },
    dspRxBits: 24,
    dspTxBits: 16,
    logging: {
      consoleLevel: "debug",
      dumpToFile: 0
    },
    os: "Ubuntu 18.04 LTS",
    pid: 8958,
    qtVersion: "5.9.5",
    version: "4.0.3"
  };