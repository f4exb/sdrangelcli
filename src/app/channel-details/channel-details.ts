import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings
}

export interface ChannelReport {
    AMDemodReport: AMDemodReport,
    channelType: string,
    tx: number    
}