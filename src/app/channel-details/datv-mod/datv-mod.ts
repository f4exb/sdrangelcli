export interface DATVModSettings {
    inputFrequencyOffset: number;
    rfBandwidth: number;
    standard: number;
    modulation: number;
    fec: number;
    symbolRate: number;
    rollOff: number;
    tsSource: number;
    tsFileName: string;
    tsFilePlayLoop: number; // boolean
    tsFilePlay: number; // boolean
    udpAddress: string;
    udpPort: number;
    channelMute: number; // boolean
    title: string;
    rgbColor: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const DATVMOD_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    rfBandwidth: 0,
    standard: 0,
    modulation: 0,
    fec: 0,
    symbolRate: 250000,
    rollOff: 0.35,
    tsSource: 0,
    tsFileName: '',
    tsFilePlayLoop: 0,
    tsFilePlay: 0,
    udpAddress: '127.0.0.1',
    udpPort: 5004,
    channelMute: 0,
    title: 'DATV Modulator',
    rgbColor: -256,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface DATVModReport {
    channelPowerDB: number;
    channelSampleRate: number;
    dataRate: number;
    tsFileBitrate: number;
    tsFileLength: number;
    udpByteCount: number;
}

export const DATVMOD_REPORT_DEFAULT = {
    channelPowerDB: -120,
    channelSampleRate: 1000000,
    dataRate: 250000,
    tsFileBitrate: 0,
    tsFileLength: 0,
    udpByteCount: 0
};
