export interface DATVDemodSettings {
    rfBandwidth: number;
    centerFrequency: number;
    standard: number;   // DATVDemodSettings::dvb_version
    modulation: number; // DATVDemodSettings::DATVModulation
    fec: number;        // DATVDemodSettings::DATVCodeRate
    softLDPC: number; // boolean
    softLDPCToolPath: string;
    softLDPCMaxTrials: number;
    maxBitflips: number;
    audioMute: number; // boolean
    audioDeviceName: string;
    symbolRate: number;
    notchFilters: number;
    allowDrift: number; // boolean
    fastLock: number; // boolean
    filter: number; // DATVDemodSettings::dvb_sampler
    hardMetric: number; // boolean
    rollOff: number;
    viterbi: number; // boolean
    excursion: number;
    audioVolume: number;
    videoMute: number; // boolean
    udpTSAddress: string;
    udpTSPort: number;
    udpTS: number; // boolean
    playerEnable: number; // boolean
    rgbColor: number;
    title: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const DATV_DEMOD_SETTINGS_DEFAULT = {
    rfBandwidth: 1000000,
    centerFrequency: 0,
    standard: 0,
    modulation: 0,
    fec: 0,
    softLDPC: 0,
    softLDPCToolPath: '',
    softLDPCMaxTrials: 0,
    maxBitflips: 300,
    audioMute: 0,
    audioDeviceName: 'System default device',
    symbolRate: 250000,
    notchFilters: 0,
    allowDrift: 0,
    fastLock: 0,
    filter: 0,
    hardMetric: 0,
    rollOff: 0.35,
    viterbi: 0,
    excursion: 24,
    audioVolume: 1,
    videoMute: 0,
    udpTSAddress: '127.0.0.1',
    udpTSPort: 8882,
    udpTS: 0,
    playerEnable: 0,
    rgbColor: -256,
    title: 'DATV Demodulator',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8091,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface DATVDemodReport {
    audioActive: number; // boolean
    audioDecodeOK: number; // boolean
    channelPowerDB: number;
    modcodCodeRate: number;
    modcodModulation: number;
    setByModcod: number; // boolean
    udpRunning: number; // boolean
    videoActive: number; // boolean
    videoDecodeOK: number; // boolean
    mer: number;
    cnr: number;
}

export const DATV_DEMOD_REPORT_DEFAULT = {
    audioActive: 0,
    audioDecodeOK: 0,
    channelPowerDB: -120,
    modcodCodeRate: -1,
    modcodModulation: -1,
    setByModcod: 0,
    udpRunning: 0,
    videoActive: 0,
    videoDecodeOK: 0,
    mer: 0,
    cnr: 0
};
