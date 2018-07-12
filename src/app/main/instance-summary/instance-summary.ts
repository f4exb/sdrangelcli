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