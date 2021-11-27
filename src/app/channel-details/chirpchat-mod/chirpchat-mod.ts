export interface ChirpChatModSettings {
    bandwidthIndex: number; // Index in ChirpChatModSettings::bandwidths array
    beaconMessage: string;
    channelMute: number; // boolean
    codingScheme: number; // ChirpChatModSettings::CodingScheme
    cqMessage: string;
    deBits: number;
    hasCRC: number; // boolean
    hasHeader: number; // boolean
    inputFrequencyOffset: number;
    message73: string;
    messageRepeat: number; // 0 for infinite
    messageType: number; // ChirpChatModSettings::MessageType
    myCall: string;
    myLoc: string;
    myRpt: string;
    nbParityBits: number;
    preambleChirps: number;
    qsoTextMessage: string;
    quietMillis: number;
    replyMessage: string;
    replyReportMessage: string;
    reportMessage: string;
    reverseAPIAddress: string;
    reverseAPIChannelIndex: number;
    reverseAPIDeviceIndex: number;
    reverseAPIPort: number;
    rgbColor: number;
    rrrMessage: string;
    spreadFactor: number;
    syncWord: number;
    textMessage: string;
    title: string;
    udpAddress: string;
    udpEnabled: number; // boolean
    udpPort: number;
    urCall: string;
    useReverseAPI: number; // boolean
}

export const CHIRPCHATMOD_SETTINGS_DEFAULT = {
    bandwidthIndex: 5,
    beaconMessage: 'VVV DE %1 %2',
    channelMute: 0,
    codingScheme: 0,
    cqMessage: 'CQ DE %1 %2',
    deBits: 0,
    hasCRC: 1,
    hasHeader: 1,
    inputFrequencyOffset: 0,
    message73: '%1 %2 73',
    messageRepeat: 1,
    messageType: 0,
    myCall: 'MYCALL',
    myLoc: 'AA00AA',
    myRpt: '59',
    nbParityBits: 1,
    preambleChirps: 8,
    qsoTextMessage: '%1 %2 %3',
    quietMillis: 1000,
    replyMessage: '%1 %2 %3',
    replyReportMessage: '%1 %2 R%3',
    reportMessage: '%1 %2 %3',
    reverseAPIAddress: '127.0.0.1',
    reverseAPIChannelIndex: 0,
    reverseAPIDeviceIndex: 0,
    reverseAPIPort: 8888,
    rgbColor: -65281,
    rrrMessage: '%1 %2 RRR',
    spreadFactor: 7,
    syncWord: 52,
    textMessage: 'Hello LoRa',
    title: 'ChirpChat Modulator',
    udpAddress: '127.0.0.1',
    udpEnabled: 0,
    udpPort: 9998,
    urCall: 'URCALL',
    useReverseAPI: 0
};

export interface ChirpChatModReport {
    channelPowerDB: number;
    channelSampleRate: number;
    payloadTimeMs: number;
    symbolTimeMs: number;
    totalTimeMs: number;
}

export const CHIRPCHATMOD_REPORT_DEFAULT = {
    channelPowerDB: -120,
    channelSampleRate: 0,
    payloadTimeMs: 0,
    symbolTimeMs: 32.77009582519531,
    totalTimeMs: 401.4336853027344
};
