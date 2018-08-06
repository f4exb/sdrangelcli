export interface TestSourceSettings {
    amModulation: number,
    amplitudeBits: number,
    autoCorrOptions: number,
    centerFrequency: number,
    dcFactor: number,
    fcPos: number,
    fmDeviation: number,
    frequencyShift: number,
    iFactor: number,
    log2Decim: number,
    modulation: number,
    modulationTone: number,
    phaseImbalance: number,
    qFactor: number,
    sampleRate: number,
    sampleSizeIndex: number    
}

export const TESTSOURCE_SETTINGS_DEFAULT = {
    amModulation: 50,
    amplitudeBits: 127,
    autoCorrOptions: 0,
    centerFrequency: 0,
    dcFactor: 0,
    fcPos: 2,
    fmDeviation: 50,
    frequencyShift: 0,
    iFactor: 0,
    log2Decim: 4,
    modulation: 0,
    modulationTone: 44,
    phaseImbalance: 0,
    qFactor: 0,
    sampleRate: 768000,
    sampleSizeIndex: 0    
}