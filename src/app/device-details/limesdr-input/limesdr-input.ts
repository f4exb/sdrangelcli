export interface LimeSDRInputSettings {
    antennaPath: number;
    centerFrequency: number;
    dcBlock: number;
    devSampleRate: number;
    extClock: number;
    extClockFreq: number;
    gain: number;
    gainMode: number;
    iqCorrection: number;
    lnaGain: number;
    log2HardDecim: number;
    log2SoftDecim: number;
    lpfBW: number;
    lpfFIRBW: number;
    lpfFIREnable: number;
    ncoEnable: number;
    ncoFrequency: number;
    pgaGain: number;
    tiaGain: number;
    transverterDeltaFrequency: number;
    transverterMode: number;
}

export const LIMESDR_INPUT_SETTINGS_DEFAULT = {
    antennaPath: 0,
    centerFrequency: 435000000,
    dcBlock: 0,
    devSampleRate: 3200000,
    extClock: 0,
    extClockFreq: 10000000,
    gain: 50,
    gainMode: 0,
    iqCorrection: 0,
    lnaGain: 15,
    log2HardDecim: 3,
    log2SoftDecim: 0,
    lpfBW: 4500000,
    lpfFIRBW: 2500000,
    lpfFIREnable: 0,
    ncoEnable: 0,
    ncoFrequency: 0,
    pgaGain: 16,
    tiaGain: 2,
    transverterDeltaFrequency: 0,
    transverterMode: 0
};

export interface LimeSDRInputReport {
    droppedPacketsCount: number;
    fifoFill: number;
    fifoSize: number;
    hwTimestamp: number;
    linkRate: number;
    overrunCount: number;
    streamActive: number;
    success: number;
    temperature: number;
    underrunCount: number;
}

export const LIMESDR_INPUT_REPORT_DEFAULT = {
    droppedPacketsCount: 0,
    fifoFill: 0,
    fifoSize: 1392640,
    hwTimestamp: 22726960,
    linkRate: 9034933,
    overrunCount: 0,
    streamActive: 1,
    success: 1,
    temperature: 53.53076171875,
    underrunCount: 0
};
