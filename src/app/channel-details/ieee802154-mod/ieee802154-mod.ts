// tslint:disable-next-line:class-name
export interface IEEE_802_15_4_ModSettings {
    bbNoise: number; // boolean
    beta: number;
    bitRate: number;
    channelMute: number; // boolean
    data: string;
    gain: number;
    inputFrequencyOffset: number;
    lpfTaps: number;
    modulateWhileRamping: number; // boolean
    modulation: number; // IEEE_802_15_4_ModSettings::Modulation
    polynomial: number;
    pulseShaping: number; // IEEE_802_15_4_ModSettings::PulseShaping
    rampDownBits: number;
    rampRange: number;
    rampUpBits: number;
    repeat: number; // boolean
    repeatCount: number; // -1 for infinite
    repeatDelay: number;
    reverseAPIAddress: string;
    reverseAPIChannelIndex: number;
    reverseAPIDeviceIndex: number;
    reverseAPIPort: number;
    rfBandwidth: number;
    rgbColor: number;
    scramble: number; // boolean
    spectrumRate: number;
    streamIndex: number;
    subGHzBand: number; // boolean
    symbolSpan: number;
    title: string;
    udpAddress: string;
    udpBytesFormat: number; // 0: hex string, 1: bytes
    udpEnabled: number; // boolean
    udpPort: number;
    useReverseAPI: number; // boolean
    writeToFile: number; // boolean
}

export const IEEE_802_15_4_MODSETTNGS_DEFAULT = {
    bbNoise: 0,
    beta: 1,
    bitRate: 20000,
    channelMute: 0,
    data: '01 cc 00 be ba 00 11 22 33 44 55 66 77 be ba 88 99 aa bb cc dd ee ff 53 44 52 20 41 6e 67 65 6c 20 64 6f 65 73 20 31 35 2e 34 ',
    gain: -1,
    inputFrequencyOffset: 0,
    lpfTaps: 301,
    modulateWhileRamping: 1,
    modulation: 0,
    polynomial: 264,
    pulseShaping: 0,
    rampDownBits: 0,
    rampRange: 0,
    rampUpBits: 0,
    repeat: 0,
    repeatCount: -1,
    repeatDelay: 1,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIChannelIndex: 0,
    reverseAPIDeviceIndex: 0,
    reverseAPIPort: 8888,
    rfBandwidth: 600000,
    rgbColor: -65536,
    scramble: 0,
    spectrumRate: 600000,
    streamIndex: 0,
    subGHzBand: 1,
    symbolSpan: 6,
    title: '802.15.4 Modulator',
    udpAddress: '127.0.0.1',
    udpBytesFormat: 0,
    udpEnabled: 0,
    udpPort: 9998,
    useReverseAPI: 0,
    writeToFile: 0
};

// tslint:disable-next-line:class-name
export interface IEEE_802_15_4_ModReport {
    channelPowerDB: number;
    channelSampleRate: number;
}

export const IEEE_802_15_4_MODREPORT_DEFAULT = {
    channelPowerDB: -120,
    channelSampleRate: 800000
};

// tslint:disable-next-line:class-name
export interface IEEE_802_15_4_ModActions {
    tx: number;
    data: string;
}

export const IEEE_802_15_4_MODACTIONS_DEFAULT = {
    tx: 0,
    data: '01 cc 00 be ba 00 11 22 33 44 55 66 77 be ba 88 99 aa bb cc dd ee ff 53 44 52 20 41 6e 67 65 6c 20 64 6f 65 73 20 31 35 2e 34 '
};
