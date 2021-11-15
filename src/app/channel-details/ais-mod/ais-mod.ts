export interface AISModSettings {
    inputFrequencyOffset: number;
    baud: number;
    rfBandwidth: number;
    fmDeviation: number;
    gain: number;
    channelMute: number; // bool
    repeat: number; // bool
    repeatDelay: number;
    repeatCount: number;
    rampUpBits: number;
    rampDownBits: number;
    rampRange: number;
    rfNoise: number; // bool
    writeToFile: number; // bool
    msgType: number; // AISModSettings::MsgType
    mmsi: string;
    status: number; // AISModSettings::Settings
    latitude: number;
    longitude: number;
    course: number;
    speed: number;
    heading: number;
    data: string; // message
    bt: number;
    symbolSpan: number;
    rgbColor: number;
    title: string;
    udpEnabled: number; // bool
    udpAddress: string;
    udpPort: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const AISMOD_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    baud: 9600,
    rfBandwidth: 25000,
    fmDeviation: 4800,
    gain: -1,
    channelMute: 0,
    repeat: 0,
    repeatDelay: 1,
    repeatCount: -1,
    rampUpBits: 0,
    rampDownBits: 0,
    rampRange: 60,
    rfNoise: 0,
    writeToFile: 0,
    msgType: 0,
    mmsi: '0000000000',
    status: 0,
    latitude: 0,
    longitude: 0,
    course: 0,
    speed: 0,
    heading: 0,
    data: '',
    bt: 0.4,
    symbolSpan: 3,
    udpEnabled: 0,
    udpAddress: '127.0.0.1',
    udpPort: 9998,
    rgbColor: -256,
    title: 'AIS Modulator',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface AISModReport {
    channelPowerDB: number;
    channelSampleRate: number;
}

export const AISMOD_REPORT_DEFAULT = {
    channelPowerDB: -100,
    channelSampleRate: 96000,
};

export interface AISModActions {
    encode: number; // bool
    tx: number; // bool
}

export const AISMOD_ACTION_DEFAULT = {
    encode: 0,
    tx : 0
};
