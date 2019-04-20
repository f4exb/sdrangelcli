export interface WFMDemodSettings {
    afBandwidth: number;
    audioDeviceName: string;
    audioMute: number;
    inputFrequencyOffset: number;
    rfBandwidth: number;
    rgbColor: number;
    squelch: number;
    title: string;
    volume: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const WFMDEMOD_SETTINGS_DEFAULT = {
    afBandwidth: 15000,
    audioDeviceName: 'System default device',
    audioMute: 0,
    inputFrequencyOffset: 0,
    rfBandwidth: 200000,
    rgbColor: -16776961,
    squelch: -60,
    title: 'WFM Demodulator',
    volume: 2,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface WFMDemodReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
    squelch: number;
}

export const WFMDEMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 384000,
    squelch: 1
};
