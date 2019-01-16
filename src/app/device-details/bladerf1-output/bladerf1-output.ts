export interface BladeRF1OutputSettings {
    centerFrequency?: number;
    devSampleRate?: number;
    vga1?: number;
    vga2?: number;
    bandwidth?: number;
    log2Interp?: number;
    xb200?: number;
    xb200Path?: number;
    xb200Filter?: number;
    useReverseAPI?: number;
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const BLADERF1_OUTPUT_SETTINGS_DEFAULT = {
    centerFrequency: 435000 * 1000,
    devSampleRate: 3072000,
    vga1: -20,
    vga2: 20,
    bandwidth: 1500000,
    log2Interp: 4,
    xb200: 0,
    xb200Path: 0,
    xb200Filter: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};
