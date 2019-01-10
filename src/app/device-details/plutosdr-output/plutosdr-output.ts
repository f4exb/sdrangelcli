export interface PlutoSDROutputSettings {
    LOppmTenths: number;
    antennaPath: number;
    att: number;
    centerFrequency: number;
    devSampleRate: number;
    log2Interp: number;
    lpfBW: number;
    lpfFIRBW: number;
    lpfFIREnable: number;
    lpfFIRGain: number;
    lpfFIRlog2Interp: number;
    transverterDeltaFrequency: number;
    transverterMode: number;
}

export const PLUTOSDR_OUTPUT_SETTINGS_DEFAULT = {
    LOppmTenths: 17,
    antennaPath: 0,
    att: -50,
    centerFrequency: 435000000,
    devSampleRate: 2400000,
    log2Interp: 3,
    lpfBW: 625000,
    lpfFIRBW: 500000,
    lpfFIREnable: 0,
    lpfFIRGain: 0,
    lpfFIRlog2Interp: 0,
    transverterDeltaFrequency: 0,
    transverterMode: 0
};

export interface PlutoSDROutputReport {
    dacRate: number;
    rssi: string;
    temperature: number;
}

export const PLUTOSDR_OUTPUT_REPORT_DEFAULT = {
    dacRate: 29999999,
    rssi: '0.00 dB',
    temperature: 29.825000762939453
};
