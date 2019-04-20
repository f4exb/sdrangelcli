export interface UDPSourceSettings {
    amModFactor: number;
    autoRWBalance: number;
    channelMute: number;
    fmDeviation: number;
    gainIn: number;
    gainOut: number;
    inputFrequencyOffset: number;
    inputSampleRate: number;
    lowCutoff: number;
    rfBandwidth: number;
    rgbColor: number;
    sampleFormat: number;
    squelch: number;
    squelchEnabled: number;
    squelchGate: number;
    stereoInput: number;
    title: string;
    udpAddress: string;
    udpPort: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const UDP_SOURCE_SETTINGS_DEFAULT = {
    amModFactor: 0.949999988079071,
    autoRWBalance: 1,
    channelMute: 0,
    fmDeviation: 2500,
    gainIn: 1,
    gainOut: 1,
    inputFrequencyOffset: 0,
    inputSampleRate: 48000,
    lowCutoff: 0,
    rfBandwidth: 12500,
    rgbColor: -2025117,
    sampleFormat: 1,
    squelch: -60,
    squelchEnabled: 1,
    squelchGate: 0.05000000074505806,
    stereoInput: 0,
    title: 'UDP Sample Sink',
    udpAddress: '192.168.1.3',
    udpPort: 9998,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface UDPSourceReport {
    channelPowerDB: number;
    channelSampleRate: number;
}

export const UDP_SOURCE_REPORT_DEFAULT = {
    channelPowerDB: -120,
    channelSampleRate: 50000
};
