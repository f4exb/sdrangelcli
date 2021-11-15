export interface PagerDemodSettings {
    baud: number;
    decode: number;
    reverse: number; // bool
    inputFrequencyOffset: number;
    rfBandwidth: number;
    fmDeviation: number;
    udpEnabled: number; // bool
    udpAddress: string;
    udpPort: number;
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

export const PAGERDEMOD_SETTINGS_DEFAULT = {
    baud: 2400,
    decode: 0,
    reverse: 0,
    inputFrequencyOffset: 0,
    rfBandwidth: 16000,
    fmDeviation: 4800,
    udpEnabled: 0,
    udpAddress: '127.0.0.1',
    udpPort: 9999,
    logFilename: 'packet_log.csv',
    logEnabled: 0,
    rgbColor: -256,
    title: 'ADSB Demodulator',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface PagerDemodReport {
    channelPowerDB: number;
    channelSampleRate: number;
}

export const PAGERDEMOD_REPORT_DEFAULT = {
    channelPowerDB: -120,
    channelSampleRate: 48000
};
