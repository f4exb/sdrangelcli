export interface HackRFOutputSettings {
    LOppmTenths: number;
    bandwidth: number;
    biasT: number;
    centerFrequency: number;
    devSampleRate: number;
    fcPos: number;
    lnaExt: number;
    log2Interp: number;
    vgaGain: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const HACKRF_OUTPUT_SETTINGS_DEFAULT = {
    LOppmTenths: -54,
    bandwidth: 1750000,
    biasT: 0,
    centerFrequency: 435000000,
    devSampleRate: 2000000,
    fcPos: 2,
    lnaExt: 1,
    log2Interp: 5,
    vgaGain: 19,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
