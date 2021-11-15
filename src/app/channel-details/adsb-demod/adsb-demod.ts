export interface ADSBDemodSettings {
    inputFrequencyOffset: number;
    rfBandwidth: number;
    correlationThreshold: number;
    samplesPerBit: number;
    correlateFullPreamble: number; // bool
    demodModeS: number; // bool
    interpolatorPhaseSteps: number;
    interpolatorTapsPerPhase: number;
    removeTimeout: number;
    beastEnabled: number; // bool
    beastHost: string;
    beastPort: number;
    feedFormat: number;
    logFilename: string;
    logEnabled: number; // bool
    rgbColor: number;
    title: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const ADSBDEMOD_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    rfBandwidth: 2600000,
    correlationThreshold: 6,
    samplesPerBit: 4,
    correlateFullPreamble: 1,
    demodModeS: 1,
    interpolatorPhaseSteps: 4,
    interpolatorTapsPerPhase: 3.5,
    removeTimeout: 60,
    beastEnabled: 0,
    beastHost: 'feed.adsbexchange.com',
    beastPort: 30005,
    feedFormat: 0,
    logFilename: 'adsb_log.csv',
    logEnabled: 0,
    rgbColor: -256,
    title: 'ADSB Demodulator',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface ADSBDemodReport {
    channelPowerDB: number;
    channelSampleRate: number;
    targetName: string;
    targetAzimuth: number;
    targetElevation: number;
    targetRange: number;
}

export const ADSBDEMOD_REPORT_DEFAULT = {
    channelPowerDB: -100,
    channelSampleRate: 4000000,
    targetName: 'ICAO: ffffff',
    targetAzimuth: 0,
    targetElevation: 0,
    targetRange: 0
};
