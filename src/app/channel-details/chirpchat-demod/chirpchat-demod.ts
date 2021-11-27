export interface ChirpChatDemodSettings {
    autoNbSymbolsMax: number; // boolean
    bandwidthIndex: number;
    codingScheme: number;
    deBits: number;
    decodeActive: number; // boolean
    eomSquelchTenths: number;
    fftWindow: number;
    hasCRC: number; // boolean
    hasHeader: number; // boolean
    inputFrequencyOffset: number;
    nbParityBits: number;
    nbSymbolsMax: number;
    preambleChirps: number;
    reverseAPIAddress: string;
    reverseAPIChannelIndex: number;
    reverseAPIDeviceIndex: number;
    reverseAPIPort: number;
    rgbColor: number;
    sendViaUDP: number; // boolean
    spreadFactor: number;
    title: string;
    udpAddress: string;
    udpPort: number;
    useReverseAPI: number; // booleab
}

export const CHIRPCHATDEMOD_SETTINGS_DEFAULT = {
    autoNbSymbolsMax: 0,
    bandwidthIndex: 1,
    codingScheme: 2,
    deBits: 2,
    decodeActive: 1,
    eomSquelchTenths: 68,
    fftWindow: 5,
    hasCRC: 1,
    hasHeader: 0,
    inputFrequencyOffset: 0,
    nbParityBits: 2,
    nbSymbolsMax: 140,
    preambleChirps: 8,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIChannelIndex: 0,
    reverseAPIDeviceIndex: 0,
    reverseAPIPort: 8888,
    rgbColor: -65281,
    sendViaUDP: 0,
    spreadFactor: 7,
    title: 'ChirpChat Demodulator',
    udpAddress: '127.0.0.1',
    udpPort: 9999,
    useReverseAPI: 0
};

export interface ChirpChatDemodReport {
    channelPowerDB: number;
    channelSampleRate: number;
    hasCRC: number; // boolean
    headerCRCStatus: number; // boolean
    headerParityStatus: number;
    messageString: string;
    messageTimestamp: string;
    nbCodewords: number;
    nbParityBits: number;
    nbSymbols: number;
    noisePowerDB: number;
    packetLength: number;
    payloadCRCStatus: number;
    payloadParityStatus: number;
    signalPowerDB: number;
    snrPowerDB: number;
    decoding: number; // boolean
}

export const CHIRPCHATDEMOD_REPORT_DEFAULT = {
    channelPowerDB: -66.6503677368164,
    channelSampleRate: 3000,
    hasCRC: 0,
    headerCRCStatus: 1,
    headerParityStatus: 0,
    messageString: 'VVV DE F4EXB JN33NN',
    messageTimestamp: '2021-11-21T23:01:33.598',
    nbCodewords: 110,
    nbParityBits: 2,
    nbSymbols: 134,
    noisePowerDB: -59.88705825805664,
    packetLength: 55,
    payloadCRCStatus: 1,
    payloadParityStatus: 0,
    signalPowerDB: -46.79887390136719,
    snrPowerDB: 12.644622802734375,
    decoding: 0
};
