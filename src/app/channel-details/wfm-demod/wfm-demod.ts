export interface WFMDemodSettings {
    afBandwidth: number,
    audioDeviceName: string,
    audioMute: number,
    inputFrequencyOffset: number,
    rfBandwidth: number,
    rgbColor: number,
    squelch: number,
    title: string,
    volume: number    
}

export const WFMDEMOD_SETTINGS_DEFAULT = {
    afBandwidth: 15000,
    audioDeviceName: "System default device",
    audioMute: 0,
    inputFrequencyOffset: 0,
    rfBandwidth: 200000,
    rgbColor: -16776961,
    squelch: -60,
    title: "WFM Demodulator",
    volume: 2    
}

export interface WFMDemodReport {
    audioSampleRate: number,
    channelPowerDB: number,
    channelSampleRate: number,
    squelch: number    
}

export const WFMDEMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -120,
    channelSampleRate: 384000,
    squelch: 1    
}