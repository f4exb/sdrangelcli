export interface LimeSDROutputSettings {
    antennaPath: number,
    centerFrequency: number,
    devSampleRate: number,
    extClock: number,
    extClockFreq: number,
    gain: number,
    log2HardInterp: number,
    log2SoftInterp: number,
    lpfBW: number,
    lpfFIRBW: number,
    lpfFIREnable: number,
    ncoEnable: number,
    ncoFrequency: number,
    transverterDeltaFrequency: number,
    transverterMode: number
}

export const LIMESDR_OUTPUT_SETTINGS_DEFAULT = {
    antennaPath: 1,
    centerFrequency: 435500000,
    devSampleRate: 3000000,
    extClock: 0,
    extClockFreq: 10000000,
    gain: 6,
    log2HardInterp: 3,
    log2SoftInterp: 4,
    lpfBW: 5500000,
    lpfFIRBW: 2500000,
    lpfFIREnable: 0,
    ncoEnable: 1,
    ncoFrequency: -500000,
    transverterDeltaFrequency: 0,
    transverterMode: 0
}

export interface LimeSDROutputReport {
    droppedPacketsCount: number,
    fifoFill: number,
    fifoSize: number,
    hwTimestamp: number,
    linkRate: number,
    overrunCount: number,
    streamActive: number,
    success: number,
    temperature: number,
    underrunCount: number
}

export const LIMESDR_OUTPUT_REPORT_DEFAULT = {
    droppedPacketsCount: 0,
    fifoFill: 0,
    fifoSize: 1,
    hwTimestamp: 0,
    linkRate: 0,
    overrunCount: 0,
    streamActive: 0,
    success: 0,
    temperature: 54.47434997558594,
    underrunCount: 0
}