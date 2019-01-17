export interface SDRplaySettings {
    centerFrequency?: number;
    tunerGain?: number;
    LOppmTenths?: number;
    frequencyBandIndex?: number;
    ifFrequencyIndex?: number;
    bandwidthIndex?: number;
    devSampleRateIndex?: number;
    log2Decim?: number;
    fcPos?: number;
    dcBlock?: number; // bool
    iqCorrection?: number; // bool
    tunerGainMode?: number; // bool
    lnaOn?: number; // bool
    mixerAmpOn?: number; // bool
    basebandGain?: number;
    fileRecordName?: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const SDRPLAY_SETTINGS_DEFAULT = {
    centerFrequency: 7040 * 1000,
    tunerGain: 0,
    LOppmTenths: 0,
    frequencyBandIndex: 0,
    ifFrequencyIndex: 0,
    bandwidthIndex: 0,
    devSampleRateIndex: 0,
    log2Decim: 0,
    fcPos: 2,
    dcBlock: 0,
    iqCorrection: 0,
    tunerGainMode: 1,
    lnaOn: 0,
    mixerAmpOn: 0,
    basebandGain: 29,
    fileRecordName: '',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
