export interface AMDemodSettings {
    audioDeviceName: string;
    audioMute: number;
    bandpassEnable: number;
    inputFrequencyOffset: number;
    rfBandwidth: number;
    rgbColor: number;
    squelch: number;
    title: string;
    volume: number;
    pll: number;
    syncAMOperation: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const AMDEMOD_SETTINGS_DEFAULT = {
    audioDeviceName: 'System default device',
    audioMute: 0,
    bandpassEnable: 0,
    inputFrequencyOffset: 0,
    rfBandwidth: 5000,
    rgbColor: -256,
    squelch: -40,
    title: 'AM Demodulator',
    volume: 2,
    pll: 0,
    syncAMOperation: 0
};

export interface AMDemodReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
    squelch: number; // boolean
}

export const AMDEMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -100,
    channelSampleRate: 96000,
    squelch: 0 // boolean

};
