import { AMDemodSettings, AMDemodReport } from "./am-demod/am-demod";
import { NFMDemodReport, NFMDemodSettings } from "./nfm-demod/nfm-demod";
import { SSBDemodReport, SSBDemodSettings } from "./ssb-demod/ssb-demod";
import { BFMDemodSettings, BFMDemodReport } from "./bfm-demod/bfm-demod";
import { DSDDemodSettings, DSDDemodReport } from "./dsd-demod/dsd-demod";
import { WFMDemodReport, WFMDemodSettings } from "./wfm-demod/wfm-demod";
import { AMModSettings, AMModReport } from "./am-mod/am-mod";
import { NFMModReport, NFMModSettings } from "./nfm-mod/nfm-mod";
import { WFMModSettings, WFMModReport } from "./wfm-mod/wfm-mod";
import { SSBModReport, SSBModSettings } from "./ssb-mod/ssb-mod";
import { UDPSinkReport, UDPSinkSettings } from "./udp-sink/udp-sink";
import { UDPSourceSettings, UDPSourceReport } from "./udp-source/udp-source";
import { DaemonSourceSettings, DaemonSourceReport } from "./daemon-source/daemon-source";
import { DaemonSinkSettings } from "./daemon-sink/daemon-sink";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings,
    BFMDemodSettings?: BFMDemodSettings,
    NFMDemodSettings?: NFMDemodSettings,
    SSBDemodSettings?: SSBDemodSettings,
    DSDDemodSettings?: DSDDemodSettings,
    WFMDemodSettings?: WFMDemodSettings,
    AMModSettings?: AMModSettings,
    NFMModSettings?: NFMModSettings,
    DaemonSourceSettings?: DaemonSourceSettings,
    DaemonSinkSettings?: DaemonSinkSettings,
    SSBModSettings?: SSBModSettings,
    UDPSourceSettings?: UDPSourceSettings,
    UDPSinkSettings?: UDPSinkSettings,
    WFMModSettings?: WFMModSettings
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport,
    BFMDemodReport?: BFMDemodReport,
    NFMDemodReport?: NFMDemodReport,
    SSBDemodReport?: SSBDemodReport,
    DSDDemodReport?: DSDDemodReport,
    WFMDemodReport?: WFMDemodReport,
    AMModReport?: AMModReport,
    NFMModReport?: NFMModReport,
    DaemonSourceReport?: DaemonSourceReport,
    SSBModReport?: SSBModReport,
    UDPSourceReport?: UDPSourceReport,
    UDPSinkReport?: UDPSinkReport,
    WFMModReport?: WFMModReport,
    channelType: string,
    tx: number
}