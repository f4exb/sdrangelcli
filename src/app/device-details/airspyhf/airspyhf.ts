export interface AirspyHFSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    devSampleRateIndex?: number;
    log2Decim?: number;
    transverterMode?: number;
    transverterDeltaFrequency?: number;
    bandIndex?: number;
    fileRecordName?: string;
    useReverseAPI: number;
    reverseAPIDeviceIndex: number;
    reverseAPIAddress: string;
    reverseAPIPort: number;
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
    reverseAPIPort: 8888
};
