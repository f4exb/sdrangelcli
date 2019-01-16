export interface BladeRF2OutputSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    devSampleRate?: number;
    bandwidth?: number;
    globalGain?: number;
    biasTee?: number;
    log2Interp?: number;
    transverterMode?: number;
    transverterDeltaFrequency?: number;
    fileRecordName?: string;
    useReverseAPI?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const BLADERF2_OUTPUT_SETTINGS_DEFAULT = {
    centerFrequency: 4350000 * 1000,
    LOppmTenths: 0,
    devSampleRate: 3072000,
    bandwidth: 1500000,
    globalGain: 20,
    biasTee: 0,
    log2Interp: 4,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    fileRecordName: 'none',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
