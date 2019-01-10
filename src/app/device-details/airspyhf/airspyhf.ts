export interface AirspyHFSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    devSampleRateIndex?: number;
    log2Decim?: number;
    transverterMode?: number;
    transverterDeltaFrequency?: number;
    bandIndex?: number;
    fileRecordName?: string;
}

export const AIRSPYHF_SETTINGS_DEFAULT = {
    centerFrequency: 0,
    LOppmTenths: 0,
    devSampleRateIndex: 0,
    log2Decim: 0,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    bandIndex: 0,
    fileRecordName: 'none'
};
