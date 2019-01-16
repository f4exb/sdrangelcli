export interface BladeRF1OutputSettings {
    centerFrequency?: number;
    devSampleRate?: number;
    lnaGain?: number;
    vga1?: number;
    vga2?: number;
    bandwidth?: number;
    log2Decim?: number;
    fcPos?: number;
    xb200?: number;
    xb200Path?: number;
    xb200Filter?: number;
    dcBlock?: number;
    iqCorrection?: number;
    fileRecordName?: string;
    useReverseAPI?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const BLADERF1_OUTPUT_SETTINGS_DEFAULT = {
    centerFrequency: 0,
    devSampleRate: 3072000,
    lnaGain: 0,
    vga1: 20,
    vga2: 9,
    bandwidth: 1500000,
    log2Decim: 4,
    fcPos: 2,
    xb200: 0,
    xb200Path: 0,
    xb200Filter: 0,
    dcBlock: 0,
    iqCorrection: 0,
    fileRecordName: 'none',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
