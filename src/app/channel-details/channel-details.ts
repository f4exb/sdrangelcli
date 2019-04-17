import { AMDemodSettings, AMDemodReport } from './am-demod/am-demod';
import { NFMDemodReport, NFMDemodSettings } from './nfm-demod/nfm-demod';
import { SSBDemodReport, SSBDemodSettings } from './ssb-demod/ssb-demod';
import { BFMDemodSettings, BFMDemodReport } from './bfm-demod/bfm-demod';
import { DSDDemodSettings, DSDDemodReport } from './dsd-demod/dsd-demod';
import { WFMDemodReport, WFMDemodSettings } from './wfm-demod/wfm-demod';
import { AMModSettings, AMModReport } from './am-mod/am-mod';
import { NFMModReport, NFMModSettings } from './nfm-mod/nfm-mod';
import { WFMModSettings, WFMModReport } from './wfm-mod/wfm-mod';
import { SSBModReport, SSBModSettings } from './ssb-mod/ssb-mod';
import { UDPSinkReport, UDPSinkSettings } from './udp-sink/udp-sink';
import { UDPSourceSettings, UDPSourceReport } from './udp-source/udp-source';
import { RemoteSourceSettings, RemoteSourceReport } from './remote-source/remote-source';
import { RemoteSinkSettings } from './remote-sink/remote-sink';
import { FreeDVModSettings, FreeDVModReport } from './freedv-mod/freedv-mod';

export interface ChannelSettings {
    channelType: string;
    tx: number;
    AMDemodSettings?: AMDemodSettings;
    BFMDemodSettings?: BFMDemodSettings;
    FreeDVModSettings?: FreeDVModSettings;
    NFMDemodSettings?: NFMDemodSettings;
    SSBDemodSettings?: SSBDemodSettings;
    DSDDemodSettings?: DSDDemodSettings;
    WFMDemodSettings?: WFMDemodSettings;
    AMModSettings?: AMModSettings;
    NFMModSettings?: NFMModSettings;
    RemoteSourceSettings?: RemoteSourceSettings;
    RemoteSinkSettings?: RemoteSinkSettings;
    SSBModSettings?: SSBModSettings;
    UDPSourceSettings?: UDPSourceSettings;
    UDPSinkSettings?: UDPSinkSettings;
    WFMModSettings?: WFMModSettings;
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport;
    BFMDemodReport?: BFMDemodReport;
    FreeDVModReport?: FreeDVModReport;
    NFMDemodReport?: NFMDemodReport;
    SSBDemodReport?: SSBDemodReport;
    DSDDemodReport?: DSDDemodReport;
    WFMDemodReport?: WFMDemodReport;
    AMModReport?: AMModReport;
    NFMModReport?: NFMModReport;
    RemoteSourceReport?: RemoteSourceReport;
    SSBModReport?: SSBModReport;
    UDPSourceReport?: UDPSourceReport;
    UDPSinkReport?: UDPSinkReport;
    WFMModReport?: WFMModReport;
    channelType: string;
    tx: number;
}
