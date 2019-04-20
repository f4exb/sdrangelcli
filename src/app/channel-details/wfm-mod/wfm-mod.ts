import { CWKEYER_SETTINGS_DEFAULT, CWKeyerSettings } from '../cw-keyer/cw-keyer';

export interface WFMModSettings {
    afBandwidth: number;
    audioDeviceName: string;
    channelMute: number;
    cwKeyer: CWKeyerSettings;
    fmDeviation: number;
    inputFrequencyOffset: number;
    modAFInput: number;
    playLoop: number;
    rfBandwidth: number;
    rgbColor: number;
    title: string;
    toneFrequency: number;
    volumeFactor: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const WFMMOD_SETTINGS_DEFAULT = {
    afBandwidth: 15000,
    audioDeviceName: 'System default device',
    channelMute: 0,
    cwKeyer: CWKEYER_SETTINGS_DEFAULT,
    fmDeviation: 50000,
    inputFrequencyOffset: 0,
    modAFInput: 0,
    playLoop: 0,
    rfBandwidth: 125000,
    rgbColor: -16776961,
    title: 'WFM Modulator',
    toneFrequency: 1000,
    volumeFactor: 1,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface WFMModReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
}

export const WFMMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 224000
};
