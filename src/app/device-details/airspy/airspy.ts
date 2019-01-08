export interface AirspySettings {
    centerFrequency?: number,
    LOppmTenths?: number,
    devSampleRateIndex?: number,
    lnaGain?: number,
    mixerGain?: number,
    vgaGain?: number,
    lnaAGC?: number,
    mixerAGC?: number,
    log2Decim?: number,
    fcPos?: number,
    biasT?: number,
    dcBlock?: number,
    iqCorrection?: number,
    transverterMode?: number,
    transverterDeltaFrequency?: number,
    fileRecordName?: string
}

export const AIRSPY_SETTINGS_DEFAULT = {
    centerFrequency: 0,
    LOppmTenths: 0,
    devSampleRateIndex: 0,
    lnaGain: 14,
    mixerGain: 15,
    vgaGain: 4,
    lnaAGC: 0,
    mixerAGC: 0,
    log2Decim: 0,
    fcPos: 2,
    biasT: 0,
    dcBlock: 0,
    iqCorrection: 0,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    fileRecordName: 'none'
}

export interface AirspyRate {
    rate: number
}

export interface AirspyReport {
    sampleRates: AirspyRate[]
}

export const AIRSPY_REPORT_DEFAULT = {
    sampleRates: [
        { rate: 6000000},
        { rate: 3000000}
    ]
}