export interface PerseusSettings {
    LOppmTenths: number;
    adcDither: number;
    adcPreamp: number;
    attenuator: number;
    centerFrequency: number;
    devSampleRateIndex: number;
    log2Decim: number;
    transverterDeltaFrequency: number;
    transverterMode: number;
    wideBand: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const PERSEUS_SETTINGS_DEFAULT = {
    LOppmTenths: 0,
    adcDither: 0,
    adcPreamp: 0,
    attenuator: 0,
    centerFrequency: 14160000,
    devSampleRateIndex: 2,
    log2Decim: 0,
    transverterDeltaFrequency: 0,
    transverterMode: 0,
    wideBand: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};

export interface PerseusRate {
    rate: number;
}

export interface PerseusReport {
    sampleRates: PerseusRate[];
}

export const PERSEUS_REPORT_DEFAULT = {
    sampleRates: [
        { rate: 48000},
        { rate: 96000}
    ]
};
