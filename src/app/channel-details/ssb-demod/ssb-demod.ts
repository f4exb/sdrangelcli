export interface SSBDemodSettings {
    agc: number;
    agcClamping: number;
    agcPowerThreshold: number;
    agcThresholdGate: number;
    agcTimeLog2: number;
    audioBinaural: number;
    audioDeviceName: string;
    audioFlipChannels: number;
    audioMute: number;
    dsb: number;
    inputFrequencyOffset: number;
    lowCutoff: number;
    rfBandwidth: number;
    rgbColor: number;
    spanLog2: number;
    title: string;
    volume: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const SSBDEMOD_SETTINGS_DEFAULT = {
    agc: 1,
    agcClamping: 0,
    agcPowerThreshold: -100,
    agcThresholdGate: 4,
    agcTimeLog2: 8,
    audioBinaural: 1,
    audioDeviceName: 'System default device',
    audioFlipChannels: 0,
    audioMute: 0,
    dsb: 0,
    inputFrequencyOffset: 0,
    lowCutoff: 300,
    rfBandwidth: 2700,
    rgbColor: -16711936,
    spanLog2: 4,
    title: 'SSB Demodulator',
    volume: 2,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface SSBDemodReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
    squelch: number;
}

export const SSBDEMOD_REPORT_DEFAULT = {
    'audioSampleRate': 48000,
    'channelPowerDB': -90,
    'channelSampleRate': 96000,
    'squelch': 0
};
