export interface AISDemodSettings {
    baud: number;
    inputFrequencyOffset: number;
    rfBandwidth: number;
    fmDeviation: number;
    correlationThreshold: number;
    udpEnabled: number; // bool
    udpAddress: string;
    udpPort: number;
    udpFormat: number; // 0 for binary, 1 for NMEA
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

export const AISDEMOD_SETTINGS_DEFAULT = {
    baud: 9600,
    inputFrequencyOffset: 0,
    rfBandwidth: 16000,
    fmDeviation: 4800,
    correlationThreshold: 30,
    udpEnabled: 0,
    udpAddress: '127.0.0.1',
    udpPort: 9999,
    udpFormat: 0,
    logFilename: 'ais_log.csv',
    logEnabled: 0,
    rgbColor: -256,
    title: 'AIS Demodulator',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface AISDemodReport {
    channelPowerDB: number;
    channelSampleRate: number;
}

export const AISDEMOD_REPORT_DEFAULT = {
    channelPowerDB: -100,
    channelSampleRate: 96000,
};
