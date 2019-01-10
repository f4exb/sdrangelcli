export interface HackRFOutputSettings {
    LOppmTenths: number;
    bandwidth: number;
    biasT: number;
    centerFrequency: number;
    devSampleRate: number;
    lnaExt: number;
    log2Interp: number;
    vgaGain: number;
}

export const HACKRF_OUTPUT_SETTINGS_DEFAULT = {
    LOppmTenths: -54,
    bandwidth: 1750000,
    biasT: 0,
    centerFrequency: 435000000,
    devSampleRate: 2000000,
    lnaExt: 1,
    log2Interp: 5,
    vgaGain: 19
};
