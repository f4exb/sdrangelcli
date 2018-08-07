import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";
import { NFMDemodReport, NFMDemodSettings } from "./nfm-demod/nfm-demod";
import { SSBDemodReport, SSBDemodSettings } from "./ssb-demod/ssb-demod";
import { BFMDemodSettings, BFMDemodReport } from "./bfm-demod/bfm-demod";
import { DSDDemodSettings, DSDDemodReport } from "./dsd-demod/dsd-demod";
import { WFMDemodReport, WFMDemodSettings } from "./wfm-demod/wfm-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings,
    BFMDemodSettings?: BFMDemodSettings,
    NFMDemodSettings?: NFMDemodSettings,
    SSBDemodSettings?: SSBDemodSettings,
    DSDDemodSettings?: DSDDemodSettings,
    WFMDemodSettings?: WFMDemodSettings
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport,
    BFMDemodReport?: BFMDemodReport,
    NFMDemodReport?: NFMDemodReport,
    SSBDemodReport?: SSBDemodReport,
    DSDDemodReport?: DSDDemodReport,
    WFMDemodReport?: WFMDemodReport,
    channelType: string,
    tx: number
}