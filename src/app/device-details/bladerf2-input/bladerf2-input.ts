export interface BladeRF2InputSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    devSampleRate?: number;
    bandwidth?: number;
    gainMode?: number;
    globalGain?: number;
    biasTee?: number;
    log2Decim?: number;
    fcPos?: number;
    dcBlock?: number;
    iqCorrection?: number;
    transverterMode?: number;
    transverterDeltaFrequency?: number;
    fileRecordName?: string;
    useReverseAPI?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const BLADERF2_INPUT_SETTINGS_DEFAULT = {
    centerFrequency: 0,
    LOppmTenths: 0,
    devSampleRate: 3072000,
    bandwidth: 1500000,
    gainMode: 0,
    globalGain: 20,
    biasTee: 0,
    log2Decim: 4,
    fcPos: 2,
    dcBlock: 0,
    iqCorrection: 0,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    fileRecordName: 'none',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
