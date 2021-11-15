export interface PacketModSettings {
    ax25Control: number;
    ax25PID: number;
    ax25PostFlags: number;
    ax25PreFlags: number;
    baud: number;
    bbNoise: number; // boolean
    beta: number;
    bpf: number; // boolean
    bpfHighCutoff: number;
    bpfLowCutoff: number;
    bpfTaps: number;
    callsign: string;
    channelMute: number; // boolean
    data: string;
    fmDeviation: number;
    gain: number;
    inputFrequencyOffset: number;
    lpfTaps: number;
    markFrequency: number;
    modulateWhileRamping: number; // boolean
    modulation: number; // PacketModSettings::Modulation
    polynomial: number;
    preEmphasis: number; // boolean
    preEmphasisHighFreq: number;
    preEmphasisTau: number;
    pulseShaping: number; // boolean
    rampDownBits: number;
    rampRange: number;
    rampUpBits: number;
    repeat: number; // boolean
    repeatCount: number;
    repeatDelay: number;
    reverseAPIAddress: string;
    reverseAPIChannelIndex: number;
    reverseAPIDeviceIndex: number;
    reverseAPIPort: number;
    rfBandwidth: number;
    rfNoise: number; // boolean
    rgbColor: number;
    scramble: number; // boolean
    spaceFrequency: number;
    spectrumRate: number;
    symbolSpan: number;
    title: string;
    to: string;
    udpAddress: string;
    udpEnabled: number; // boolean
    udpPort: number;
    useReverseAPI: number; // boolean
    via: string;
    writeToFile: number; // boolean
}

export const PACKETMOD_SETTINGS_DEFAULT = {
    ax25Control: 3,
    ax25PID: 240,
    ax25PostFlags: 4,
    ax25PreFlags: 5,
    baud: 1200,
    bbNoise: 0,
    beta: 0.5,
    bpf: 0,
    bpfHighCutoff: 2600,
    bpfLowCutoff: 800,
    bpfTaps: 301,
    callsign: 'MYCALL',
    channelMute: 0,
    data: '>Using SDRangel',
    fmDeviation: 2500,
    gain: -2,
    inputFrequencyOffset: 0,
    lpfTaps: 301,
    markFrequency: 2200,
    modulateWhileRamping: 1,
    modulation: 0,
    polynomial: 67584,
    preEmphasis: 0,
    preEmphasisHighFreq: 3000,
    preEmphasisTau: 0.000531,
    pulseShaping: 1,
    rampDownBits: 8,
    rampRange: 60,
    rampUpBits: 8,
    repeat: 0,
    repeatCount: -1,
    repeatDelay: 1,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIChannelIndex: 0,
    reverseAPIDeviceIndex: 0,
    reverseAPIPort: 8888,
    rfBandwidth: 12500,
    rfNoise: 0,
    rgbColor: -16750334,
    scramble: 0,
    spaceFrequency: 1200,
    spectrumRate: 8000,
    symbolSpan: 6,
    title: 'Packet Modulator',
    to: 'APRS',
    udpAddress: '127.0.0.1',
    udpEnabled: 0,
    udpPort: 9998,
    useReverseAPI: 0,
    via: 'WIDE2-2',
    writeToFile: 0
};

export interface PacketModReport {
    audioSampleRate: number;
    channelPowerDB: number;
    channelSampleRate: number;
}

export const PACKETMOD_REPORT_DEFAULT = {
    audioSampleRate: 48000,
    channelPowerDB: -12,
    channelSampleRate: 150000
};

export interface PacketModActions {
    tx: number; // bool
}

export const PACKETMOD_ACTIONS_DEFAULT = {
    tx : 0
};
