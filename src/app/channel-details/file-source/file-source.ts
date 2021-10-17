export interface FileSourceSettings {
    fileName: string;
    loop: number; // boolean
    log2Interp: number;
    filterChainHash: number;
    gainDB: number;
    rgbColor: number;
    title: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const FILESOURCE_SETTINGS_DEFAULT = {
    fileName: '',
    loop: 0,
    log2Interp: 0,
    filterChainHash: 0,
    gainDB: 0,
    rgbColor: -256,
    title: 'File Source',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface FileSourceReport {
    fileName: string;
    fileSampleRate: number;
    fileSampleSize: number;
    absoluteTime: number;
    elapsedTime: number;
    durationTime: number;
    sampleRate: number;
    channelPowerDB: number;
}

export const FILESOURCE_REPORT_DEFAULT = {
    fileName: '',
    fileSampleRate: 0,
    fileSampleSize: 0,
    absoluteTime: 0,
    elapsedTime: 0,
    durationTime: 0,
    sampleRate: 0,
    channelPowerDB: 0
};

export interface FileSourceActions {
    play: number; // boolean
    seekMillis: number;
}

export const FILESOURCE_ACTIONS_DEFAULT = {
    play: 0,
    seekMillis: 0
};
