export interface BFMDemodSettings {
    afBandwidth: number,
    audioDeviceName: string,
    audioStereo: number,
    inputFrequencyOffset: number,
    lsbStereo: number,
    rdsActive: number,
    rfBandwidth: number,
    rgbColor: number,
    showPilot: number,
    squelch: number,
    title: string,
    volume: number
}

export const BFMDEMOD_SETTINGS_DEFAULT = {
    "afBandwidth": 15000,
    "audioDeviceName": "System default device",
    "audioStereo": 1,
    "inputFrequencyOffset": 0,
    "lsbStereo": 0,
    "rdsActive": 0,
    "rfBandwidth": 250000,
    "rgbColor": -11503388,
    "showPilot": 0,
    "squelch": -50,
    "title": "Broadcast FM Demod",
    "volume": 2
}