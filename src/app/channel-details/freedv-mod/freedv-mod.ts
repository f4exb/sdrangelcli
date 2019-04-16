export interface FreeDVModSettings {
    inputFrequencyOffset?: number;
    toneFrequency?: number;
    volumeFactor?: number;
    spanLog2?: number;
    audioMute?: number; // bool
    playLoop?: number; // bool
    rgbColor?: number;
    title?: string;
    modAFInput?: number; // FreeDVModInputAF
    audioDeviceName?: string;
    freeDVMode?: number; // FreeDVMode
    gaugeInputElseModem?: number; // bool
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const FREEDVMOD_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    toneFrequency: 1000,
    volumeFactor: 1,
    spanLog2: 3,
    audioMute: 0,
    playLoop: 0,
    rgbColor: 65484,
    title: 'FreeDV Modulator',
    modAFInput: 0,
    audioDeviceName: 'System default device',
    freeDVMode: 0,
    gaugeInputElseModem: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface FreeDVModReport {
    channelPowerDb: number;
    audioSampleRate: number;
    channelSampleRate: number;
}

export const FREEDVMOD_REPORT_DEFAULT = {
    channelPowerDb: -1,
    audioSampleRate: 48000,
    channelSampleRate: 48000
};
