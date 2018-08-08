import { CWKEYER_SETTINGS_DEFAULT, CWKeyerSettings } from "../cw-keyer/cw-keyer";

export interface NFMModSettings {
    afBandwidth: number,
    audioDeviceName: string,
    channelMute: number,
    ctcssIndex: number,
    ctcssOn: number,
    cwKeyer: CWKeyerSettings,
    fmDeviation: number,
    inputFrequencyOffset: number,
    modAFInput: number,
    playLoop: number,
    rfBandwidth: number,
    rgbColor: number,
    title: string,
    toneFrequency: number,
    volumeFactor: number
}

export const NFMMOD_SETTINGS_DEFAULT = {
    afBandwidth: 3000,
    audioDeviceName: "System default device",
    channelMute: 0,
    ctcssIndex: 0,
    ctcssOn: 0,
    cwKeyer: CWKEYER_SETTINGS_DEFAULT,
    fmDeviation: 5000,
    inputFrequencyOffset: 0,
    modAFInput: 0,
    playLoop: 0,
    rfBandwidth: 12500,
    rgbColor: -65536,
    title: "NFM Modulator",
    toneFrequency: 1000,
    volumeFactor: 1
}

export interface NFMModReport {
    audioSampleRate: number,
    channelPowerDB: number,
    channelSampleRate: number
}

export const NFMMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 48000
}