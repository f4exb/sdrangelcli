import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";
import { NFMDemodReport, NFMDemodSettings } from "./nfm-demod/nfm-demod";
import { SSBDemodReport, SSBDemodSettings } from "./ssb-demod/ssb-demod";
import { BFMDemodSettings, BFMDemodReport } from "./bfm-demod/bfm-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings,
    BFMDemodSettings?: BFMDemodSettings,
    NFMDemodSettings?: NFMDemodSettings,
    SSBDemodSettings?: SSBDemodSettings,
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport,
    BFMDemodReport?: BFMDemodReport,
    NFMDemodReport?: NFMDemodReport,
    SSBDemodReport?: SSBDemodReport,
    channelType: string,
    tx: number
}