export interface FreeDVDemodSettings {
    inputFrequencyOffset?: number;
    volume?: number;
    volumeIn?: number;
    spanLog2?: number;
    audioMute?: number; // bool
    agc?: number; // bool
    rgbColor?: number;
    title?: string;
    audioDeviceName?: string;
    freeDVMode?: number; // FreeDVMode
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const FREEDVDEMOD_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    volume: 3,
    volumeIn: 1,
    spanLog2: 3,
    audioMute: 0,
    agc: 1,
    rgbColor: 65484,
    title: 'FreeDV Demodulator',
    audioDeviceName: 'System default device',
    freeDVMode: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface FreeDVDemodReport {
    channelPowerDb: number;
    squelch: number; // bool
    audioSampleRate: number;
    channelSampleRate: number;
}

export const FREEDVDEMOD_REPORT_DEFAULT = {
    channelPowerDb: -40,
    squelch: 0,
    audioSampleRate: 48000,
    channelSampleRate: 48000
};
