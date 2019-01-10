export interface BFMDemodSettings {
    afBandwidth: number;
    audioDeviceName: string;
    audioStereo: number;
    inputFrequencyOffset: number;
    lsbStereo: number;
    rdsActive: number;
    rfBandwidth: number;
    rgbColor: number;
    showPilot: number;
    squelch: number;
    title: string;
    volume: number;
}

export const BFMDEMOD_SETTINGS_DEFAULT = {
    'afBandwidth': 15000,
    'audioDeviceName': 'System default device',
    'audioStereo': 1,
    'inputFrequencyOffset': 0,
    'lsbStereo': 0,
    'rdsActive': 0,
    'rfBandwidth': 250000,
    'rgbColor': -11503388,
    'showPilot': 0,
    'squelch': -50,
    'title': 'Broadcast FM Demod',
    'volume': 2
};

export interface BFMDemodReportRDSAltFrequencies {
    frequency: number;
}

export interface BFMDemodReportRDS {
    altFrequencies: BFMDemodReportRDSAltFrequencies[];
    decodStatus: number;
    demodStatus: number;
    monoStereo: string;
    musicSpeech: string;
    piCoverage: string;
    piType: string;
    pid: string;
    progServiceName: string;
    radioText: string;
    rdsDemodAccumDB: number;
    rdsDemodFrequency: number;
    time: string;
}

export const BFMDEMOD_RDS_REPORT_DEFAULT = {
    altFrequencies: [
        {
          frequency: 91.30000305175781
        },
        {
          frequency: 91.5
        }
      ],
      decodStatus: 56,
      demodStatus: 96,
      monoStereo: 'Stereo',
      musicSpeech: 'Music',
      piCoverage: 'Regional 1',
      piType: 'None',
      pid: 'F441',
      progServiceName: 'CANNES R',
      radioText: '                                                                ',
      rdsDemodAccumDB: -12.640591621398926,
      rdsDemodFrequency: 1187.5,
      time: '2018-08-05 18:11 (+2.0h)'
};

export interface BFMDemodReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
    pilotLocked: number;
    pilotPowerDB: number;
    squelch: number;
    rdsReport?: BFMDemodReportRDS;
}

export const BFMDEMOD_REPORT_DEFAULT = {
    'audioSampleRate': 48000,
    'channelPowerDB': -20,
    'channelSampleRate': 300000,
    'pilotLocked': 1,
    'pilotPowerDB': -17,
    'squelch': 1
};
