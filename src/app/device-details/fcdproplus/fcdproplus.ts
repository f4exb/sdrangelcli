export interface FCDProPlusSettings {
    centerFrequency?: number;
    rangeLow?: number; // bool
    lnaGain?: number; // bool
    mixGain?: number; // bool
    biasT?: number; // bool
    ifGain?: number;
    ifFilterIndex?: number;
    rfFilterIndex?: number;
    LOppmTenths?: number;
    log2Decim?: number;
    fcPos?: number;
    dcBlock?: number; // bool
    iqImbalance?: number; // bool
    transverterMode?: number; // bool
    transverterDeltaFrequency?: number;
    fileRecordName?: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const FCDPROPLUS_SETTINGS_DEFAULT = {
    centerFrequency: 435000000,
    rangeLow: 1,
    lnaGain: 1,
    biasT: 0,
    ifGain: 0,
    mixGain: 0,
    rfFilterIndex: 0,
    ifFilterIndex: 0,
    LOppmTenths: 0,
    log2Decim: 0,
    fcPos: 2,
    dcBlock: 0,
    iqImbalance: 0,
    transverterMode: 0,
    transverterDeltaFrequency: 0,
    fileRecordName: '',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
