import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";
import { NFMDemodReport, NFMDemodSettings } from "./nfm-demod/nfm-demod";
import { SSBDemodReport, SSBDemodSettings } from "./ssb-demod/ssb-demod";
import { BFMDemodSettings } from "./bfm-demod/bfm-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings,
    NFMDemodSettings?: NFMDemodSettings,
    SSBDemodSettings?: SSBDemodSettings,
    BFMDemodSettings?: BFMDemodSettings
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport,
    NFMDemodReport?: NFMDemodReport,
    SSBDemodReport?: SSBDemodReport,
    channelType: string,
    tx: number
}