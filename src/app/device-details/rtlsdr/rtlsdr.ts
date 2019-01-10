export interface RTLSDRSettings {
    agc?: number;
    centerFrequency?: number;
    dcBlock?: number;
    devSampleRate?: number;
    fcPos?: number;
    gain?: number;
    iqImbalance?: number;
    loPpmCorrection?: number;
    log2Decim?: number;
    lowSampleRate?: number;
    noModMode?: number;
    rfBandwidth?: number;
    transverterDeltaFrequency?: number;
    transverterMode?: number;
    fileRecordName?: string;
}

export const RTLSDR_SETTINGS_DEFAULT = {
    agc: 0,
    centerFrequency: 435000000,
    dcBlock: 0,
    devSampleRate: 1024000,
    fcPos: 2,
    gain: 0,
    iqImbalance: 0,
    loPpmCorrection: 0,
    log2Decim: 4,
    lowSampleRate: 0,
    noModMode: 0,
    rfBandwidth: 2500000,
    transverterDeltaFrequency: 0,
    transverterMode: 0,
    fileRecordName: 'none'
};
