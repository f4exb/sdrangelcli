export interface PlutoSDRInputSettings {
    LOppmTenths: number,
    antennaPath: number,
    centerFrequency: number,
    dcBlock: number,
    devSampleRate: number,
    fcPos: number,
    gain: number,
    gainMode: number,
    iqCorrection: number,
    log2Decim: number,
    lpfBW: number,
    lpfFIRBW: number,
    lpfFIREnable: number,
    lpfFIRGain: number,
    lpfFIRlog2Decim: number,
    transverterDeltaFrequency: number,
    transverterMode: number
}

export const PLUTOSDR_INPUT_SETTINGS_DEFAULT = {
    LOppmTenths: 0,
    antennaPath: 0,
    centerFrequency: 435000000,
    dcBlock: 0,
    devSampleRate: 2500000,
    fcPos: 2,
    gain: 40,
    gainMode: 0,
    iqCorrection: 0,
    log2Decim: 0,
    lpfBW: 1500000,
    lpfFIRBW: 500000,
    lpfFIREnable: 0,
    lpfFIRGain: 0,
    lpfFIRlog2Decim: 0,
    transverterDeltaFrequency: 0,
    transverterMode: 0
}

export interface PlutoSDRInputReport {
    adcRate: number,
    gainDB: number,
    rssi: string,
    temperature: number
}

export const PLUTOSDR_INPUT_REPORT_DEFAULT = {
    adcRate: 29999999,
    gainDB: 40,
    rssi: "95.75 dB",
    temperature: 28.06999969482422
}

