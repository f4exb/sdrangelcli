export interface FCDProSettings {
    centerFrequency?: number;
    LOppmTenths?: number;
    lnaGainIndex?: number;
    rfFilterIndex?: number;
    lnaEnhanceIndex?: number;
    bandIndex?: number;
    mixerGainIndex?: number;
    mixerFilterIndex?: number;
    biasCurrentIndex?: number;
    modeIndex?: number;
    gain1Index?: number;
    rcFilterIndex?: number;
    gain2Index?: number;
    gain3Index?: number;
    gain4Index?: number;
    ifFilterIndex?: number;
    gain5Index?: number;
    gain6Index?: number;
    log2Decim?: number;
    fcPos?: number;
    dcBlock?: number;
    iqCorrection?: number;
    transverterMode?: number;
    transverterDeltaFrequency?: number;
    fileRecordName?: string;
    useReverseAPI?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const FCDPRO_SETTINGS_DEFAULT = {
    centerFrequency: 435000 * 1000,
    dcBlock: 0,
    iqCorrection: 0,
    LOppmTenths: 0,
    lnaGainIndex: 0,
    rfFilterIndex: 0,
    lnaEnhanceIndex: 0,
    bandIndex: 0,
    mixerGainIndex: 0,
    mixerFilterIndex: 0,
    biasCurrentIndex: 0,
    modeIndex: 0,
    gain1Index: 0,
    rcFilterIndex: 0,
    gain2Index: 0,
    gain3Index: 0,
    gain4Index: 0,
    ifFilterIndex: 0,
    gain5Index: 0,
    gain6Index: 0,
    log2Decim: 0,
    fcPos: 2,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    fileRecordName: '',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
