export interface HackRFInputSettings {
    LOppmTenths: number;
    bandwidth: number;
    biasT: number;
    centerFrequency: number;
    dcBlock: number;
    devSampleRate: number;
    fcPos: number;
    iqCorrection: number;
    linkTxFrequency: number;
    lnaExt: number;
    lnaGain: number;
    log2Decim: number;
    vgaGain: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const HACKRF_INPUT_SETTINGS_DEFAULT = {
    LOppmTenths: 0,
    bandwidth: 1750000,
    biasT: 0,
    centerFrequency: 435000000,
    dcBlock: 0,
    devSampleRate: 2400000,
    fcPos: 2,
    iqCorrection: 0,
    linkTxFrequency: 0,
    lnaExt: 0,
    lnaGain: 16,
    log2Decim: 0,
    vgaGain: 16,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
