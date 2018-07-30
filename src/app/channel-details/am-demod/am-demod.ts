export interface AMDemodSettings {
    audioDeviceName: string,
    audioMute: number,
    bandpassEnable: number,
    inputFrequencyOffset: number,
    rfBandwidth: number,
    rgbColor: number,
    squelch: number,
    title: string,
    volume: 2    
}

export const AMDEMOD_SETTINGS_DEFAULT = {
    audioDeviceName: "System default device",
    audioMute: 0,
    bandpassEnable: 0,
    inputFrequencyOffset: 0,
    rfBandwidth: 5000,
    rgbColor: -256,
    squelch: -40,
    title: "AM Demodulator",
    volume: 2
}
