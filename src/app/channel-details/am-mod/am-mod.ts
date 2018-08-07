import { CWKeyerSettings, CWKEYER_SETTINGS_DEFAULT } from "../cw-keyer/cw-keyer";

export interface AMModSettings {
    audioDeviceName: string,
    channelMute: number,
    cwKeyer: CWKeyerSettings,
    inputFrequencyOffset: number,
    modAFInput: number,
    modFactor: number,
    playLoop: number,
    rfBandwidth: number,
    rgbColor: number,
    title: string,
    toneFrequency: number,
    volumeFactor: number
}

export const AMMOD_SETTINGS_DEFAULT = {
    audioDeviceName: "System default device",
    channelMute: 0,
    cwKeyer: CWKEYER_SETTINGS_DEFAULT,
    inputFrequencyOffset: 0,
    modAFInput: 0,
    modFactor: 0.2,
    playLoop: 0,
    rfBandwidth: 12500,
    rgbColor: -256,
    title: "AM Modulator",
    toneFrequency: 1000,
    volumeFactor: 1
}

export interface AMModReport {
    audioSampleRate: number,
    channelPowerDB: number,
    channelSampleRate: number
}

export const AMMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -12,
    channelSampleRate: 150000
}
