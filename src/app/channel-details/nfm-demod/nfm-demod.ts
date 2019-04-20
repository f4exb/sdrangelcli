export interface NFMDemodSettings {
    afBandwidth: number;
    audioDeviceName: string;
    audioMute: number;
    ctcssIndex: number;
    ctcssOn: number;
    deltaSquelch: number;
    fmDeviation: number;
    inputFrequencyOffset: number;
    rfBandwidth: number;
    rgbColor: number;
    squelch: number;
    squelchGate: number;
    title: string;
    volume: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const NFMDEMOD_SETTINGS_DEFAULT = {
    afBandwidth: 3000,
    audioDeviceName: 'System default device',
    audioMute: 1,
    ctcssIndex: 0,
    ctcssOn: 0,
    deltaSquelch: 0,
    fmDeviation: 5000,
    inputFrequencyOffset: 0,
    rfBandwidth: 12500,
    rgbColor: -65536,
    squelch: -830,
    squelchGate: 30,
    title: 'NFM Demodulator',
    volume: 2,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface NFMDemodReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
    ctcssTone: number;
    squelch: number;
}

export const NFMDEMOD_REPORT_DEFAULT = {
    'audioSampleRate': 48000,
    'channelPowerDB': -90,
    'channelSampleRate': 96000,
    'ctcssTone': 0,
    'squelch': 0
};
