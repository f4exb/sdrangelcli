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
import { FreeDVDemodSettings, FreeDVDemodReport } from './freedv-demod/freedv-demod';
import { FreqTrackerSettings, FreqTrackerReport } from './freqtracker-sink/freqtracker-sink';
import { LocalSinkSettings } from './local-sink/local-sink';
import { LocalSourceSettings } from './local-source/local-source';
import { FileSinkActions, FileSinkReport, FileSinkSettings } from './file-sink/file-sink';
import { FileSinkComponent } from './file-sink/file-sink.component';
import { SigMFFileSinkActions, SigMFFileSinkReport, SigMFFileSinkSettings } from './sigmf-file-sink/sigmf-file-sink';
import { FileSourceActions, FileSourceReport, FileSourceSettings } from './file-source/file-source';

export interface ChannelSettings {
    channelType: string;
    direction: number;
    AMDemodSettings?: AMDemodSettings;
    BFMDemodSettings?: BFMDemodSettings;
    FileSinkSettings?: FileSinkSettings;
    FileSourceSettings?: FileSourceSettings;
    FreeDVDemodSettings?: FreeDVDemodSettings;
    FreeDVModSettings?: FreeDVModSettings;
    FreqTrackerSettings?: FreqTrackerSettings;
    LocalSinkSettings?: LocalSinkSettings;
    LocalSourceSettings?: LocalSourceSettings;
    NFMDemodSettings?: NFMDemodSettings;
    SSBDemodSettings?: SSBDemodSettings;
    DSDDemodSettings?: DSDDemodSettings;
    WFMDemodSettings?: WFMDemodSettings;
    AMModSettings?: AMModSettings;
    NFMModSettings?: NFMModSettings;
    RemoteSourceSettings?: RemoteSourceSettings;
    RemoteSinkSettings?: RemoteSinkSettings;
    SigMFFileSinkSettings?: SigMFFileSinkSettings;
    SSBModSettings?: SSBModSettings;
    UDPSourceSettings?: UDPSourceSettings;
    UDPSinkSettings?: UDPSinkSettings;
    WFMModSettings?: WFMModSettings;
}

export interface ChannelReport {
    AMDemodReport?: AMDemodReport;
    BFMDemodReport?: BFMDemodReport;
    FileSinkReport?: FileSinkReport;
    FileSourceReport?: FileSourceReport;
    FreeDVDemodReport?: FreeDVDemodReport;
    FreeDVModReport?: FreeDVModReport;
    FreqTrackerReport?: FreqTrackerReport;
    NFMDemodReport?: NFMDemodReport;
    SSBDemodReport?: SSBDemodReport;
    DSDDemodReport?: DSDDemodReport;
    WFMDemodReport?: WFMDemodReport;
    AMModReport?: AMModReport;
    NFMModReport?: NFMModReport;
    RemoteSourceReport?: RemoteSourceReport;
    SigMFFileSinkReport?: SigMFFileSinkReport;
    SSBModReport?: SSBModReport;
    UDPSourceReport?: UDPSourceReport;
    UDPSinkReport?: UDPSinkReport;
    WFMModReport?: WFMModReport;
    channelType: string;
    direction: number;
}

export interface ChannelActions {
    FileSinkActions?: FileSinkActions;
    FileSourceActions?: FileSourceActions;
    SigMFFileSinkActions?: SigMFFileSinkActions;
    channelType: string;
    direction: number;
}
