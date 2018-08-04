import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";
import { NFMDemodReport, NFMDemodSettings } from "./nfm-demod/nfm-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings,
    NFMDemodSettings?: NFMDemodSettings
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport,
    NFMDemodReport?: NFMDemodReport,
    channelType: string,
    tx: number
}