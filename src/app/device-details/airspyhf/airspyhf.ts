export interface AirspyHFSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    devSampleRateIndex?: number;
    log2Decim?: number;
    transverterMode?: number; // bool
    transverterDeltaFrequency?: number;
    bandIndex?: number;
    fileRecordName?: string;
    useReverseAPI?: number; // bool
    reverseAPIDeviceIndex?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    useAGC?: number; // bool
    agcHigh?: number; // bool
    useDSP?: number; // bool
    useLNA?: number; // bool
    attenuatorSteps?: number; // 0 to 8 actually multiplied by 6 dB
    dcBlock?: number; // bool
    iqCorrection?: number; // bool
}

export const AIRSPYHF_SETTINGS_DEFAULT = {
    centerFrequency: 0,
    LOppmTenths: 0,
    devSampleRateIndex: 0,
    log2Decim: 0,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    bandIndex: 0,
    fileRecordName: 'none',
    useReverseAPI: 0,
    reverseAPIDeviceIndex: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    useAGC: 0,
    agcHigh: 0,
    useDSP: 1,
    useLNA: 0,
    attenuatorSteps: 0,
    dcBlock: 0,
    iqCorrection: 0
};
