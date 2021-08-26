export interface SDRplayV3Settings {
    centerFrequency?: number;
    LOppmTenths?: number;
    ifFrequencyIndex?: number;
    bandwidthIndex?: number;
    devSampleRate?: number;
    log2Decim?: number;
    fcPos?: number;
    dcBlock?: number; // bool
    iqCorrection?: number; // bool
    lnaIndex?: number;
    ifAGC?: number; // bool
    ifGain?: number;
    amNotch?: number; // bool
    fmNotch?: number; // bool
    dabNotch?: number; // bool
    biasTee?: number; // bool
    extRef?: number; // bool
    tuner?: number;
    antenna?: number;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const SDRPLAYV3_SETTINGS_DEFAULT = {
    centerFrequency: 7040 * 1000,
    LOppmTenths: 0,
    ifFrequencyIndex: 0,
    bandwidthIndex: 0,
    devSampleRate: 2048 * 1000,
    log2Decim: 0,
    fcPos: 2,
    dcBlock: 0,
    iqCorrection: 0,
    lnaIndex: 0,
    ifAGC: 0,
    ifGain: 0,
    amNotch: 0,
    fmNotch: 0,
    dabNotch: 0,
    extRef: 0,
    tuner: 0,
    antenna: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};

export const SDRPLAYV3_ATT_FREQ_UP_BOUNDS = {
    'RSP1': [420000000, 10000000000],
    'RSP1A': [60000000, 420000000, 1000000000],
    'RSP2': [420000000, 1000000000],
    'RSPduo': [60000000, 420000000, 1000000000],
    'RSPdx': [2, 12000000, 60000000, 250000000, 420000000, 1000000000]
};

export const SDRPLAYV3_ATT = {
    'RSP1': [
        [0, 24, 19, 43],
        [0,  7, 19, 26],
        [0,  5, 19, 24]
    ],
    'RSP1A': [
        [0, 6, 12, 18, 37, 42, 61],
        [0, 6, 12, 18, 20, 26, 32, 38, 57, 62],
        [0, 7, 13, 19, 20, 27, 33, 39, 45, 64],
        [0, 6, 12, 20, 26, 32, 38, 43, 62]
    ],
    'RSP2': [
        [0, 10, 15, 21, 24, 34, 39, 45, 64],
        [0,  7, 10, 17, 22, 41],
        [0,  5, 21, 15, 15, 32]
    ],
    'RSPduo': [
        [0, 6, 12, 18, 37, 42, 61],
        [0, 6, 12, 18, 20, 26, 32, 38, 57, 62],
        [0, 7, 13, 19, 20, 27, 33, 39, 45, 64],
        [0, 6, 12, 20, 26, 32, 38, 43, 62],
        [0, 6, 12, 18, 37]
    ],
    'RSPdx': [
        [0, 3,  6,  9, 12, 15, 18, 21, 24, 25, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
        [0, 3,  6,  9, 12, 15, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
        [0, 3,  6,  9, 12, 15, 18, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60],
        [0, 3,  6,  9, 12, 15, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84],
        [0, 7, 10, 13, 16, 19, 22, 25, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67],
        [0, 5,  8, 11, 14, 17, 20, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65]
    ]
};

export const SDRPLAYV3_TUNERS = {
    'RSP1': [1],
    'RSP1A': [1],
    'RSP2': [1],
    'RSPduo': [1, 2],
    'RSPdx': [1]
};

export const SDRPLAYV3_ANTENNAS = {
    'RSP1': ['50Ohm'],
    'RSP1A': ['50Ohm'],
    'RSP2': ['A', 'B', 'Hi-Z'],
    'RSPduo': ['50Ohm', 'Hi-Z'],
    'RSPdx': ['A', 'B', 'C']
};
