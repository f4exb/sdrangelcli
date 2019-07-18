import { CWKEYER_SETTINGS_DEFAULT, CWKeyerSettings } from '../cw-keyer/cw-keyer';

export interface SSBModSettings {
    agc: number;
    audioBinaural: number;
    audioDeviceName: string;
    audioFlipChannels: number;
    audioMute: number;
    bandwidth: number;
    cwKeyer: CWKeyerSettings;
    dsb: number;
    inputFrequencyOffset: number;
    lowCutoff: number;
    modAFInput: number;
    playLoop: number;
    rgbColor: number;
    spanLog2: number;
    title: string;
    toneFrequency: number;
    usb: number;
    volumeFactor: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const SSBMOD_SETTINGS_DEFAULT = {
    agc: 0,
    audioBinaural: 0,
    audioDeviceName: 'System default device',
    audioFlipChannels: 0,
    audioMute: 0,
    bandwidth: 3000,
    cwKeyer: CWKEYER_SETTINGS_DEFAULT,
    dsb: 0,
    inputFrequencyOffset: 0,
    lowCutoff: 300,
    modAFInput: 0,
    playLoop: 0,
    rgbColor: -16711936,
    spanLog2: 3,
    title: 'SSB Modulator',
    toneFrequency: 1000,
    usb: 1,
    volumeFactor: 1,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface SSBModReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
}

export const SSBMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 224000
};
