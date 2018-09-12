export interface UDPSinkSettings {
    agc: number,
    audioActive: number,
    audioPort: number,
    audioStereo: number,
    channelMute: number,
    fmDeviation: number,
    gain: number,
    inputFrequencyOffset: number,
    outputSampleRate: number,
    rfBandwidth: number,
    rgbColor: number,
    sampleFormat: number,
    squelchDB: number,
    squelchEnabled: number,
    squelchGate: number,
    title: string,
    udpAddress: string,
    udpPort: number,
    volume: number
}

export const UDP_SINK_SETTINGS_DEFAULT = {
    agc: 0,
    audioActive: 0,
    audioPort: 9997,
    audioStereo: 0,
    channelMute: 0,
    fmDeviation: 2500,
    gain: 1,
    inputFrequencyOffset: 2500,
    outputSampleRate: 48000,
    rfBandwidth: 12500,
    rgbColor: -2025117,
    sampleFormat: 3,
    squelchDB: -60,
    squelchEnabled: 1,
    squelchGate: 0,
    title: "UDP Sample Source",
    udpAddress: "127.0.0.1",
    udpPort: 9998,
    volume: 20
}

export interface UDPSinkReport {
    channelPowerDB: number,
    inputSampleRate: number,
    squelch: number
}

export const UDP_SINK_REPORT_DEFAULT = {
    channelPowerDB: -3.778681755065918,
    inputSampleRate: 64000,
    squelch: 1
}