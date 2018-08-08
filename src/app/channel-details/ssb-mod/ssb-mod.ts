import { CWKEYER_SETTINGS_DEFAULT, CWKeyerSettings } from "../cw-keyer/cw-keyer";

export interface SSBModSettings {
    agc: number,
    agcOrder: number,
    agcThreshold: number,
    agcThresholdDelay: number,
    agcThresholdEnable: number,
    agcThresholdGate: number,
    agcTime: number,
    audioBinaural: number,
    audioDeviceName: string,
    audioFlipChannels: number,
    audioMute: number,
    bandwidth: number,
    cwKeyer: CWKeyerSettings,
    dsb: number,
    inputFrequencyOffset: number,
    lowCutoff: number,
    modAFInput: number,
    playLoop: number,
    rgbColor: number,
    spanLog2: number,
    title: string,
    toneFrequency: number,
    usb: number,
    volumeFactor: number
}

export const SSBMOD_SETTINGS_DEFAULT = {
    agc: 0,
    agcOrder: 0.2,
    agcThreshold: -40,
    agcThresholdDelay: 2400,
    agcThresholdEnable: 1,
    agcThresholdGate: 192,
    agcTime: 9600,
    audioBinaural: 0,
    audioDeviceName: "System default device",
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
    title: "SSB Modulator",
    toneFrequency: 1000,
    usb: 1,
    volumeFactor: 1
}

export interface SSBModReport {
    audioSampleRate: number,
    channelPowerDB: number,
    channelSampleRate: number
}

export const SSBMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 224000
}
