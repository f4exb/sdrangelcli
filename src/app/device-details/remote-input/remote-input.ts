export interface RemoteInputSettings {
    apiAddress?: string;
    apiPort?: number;
    dataAddress?: string;
    dataPort?: number;
    dcBlock?: number; // bool
    iqCorrection?: number; // bool
    fileRecordName?: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const REMOTE_INPUT_SETTINGS_DEFAULT = {
    apiAddress: '127.0.0.1',
    apiPort: 9091,
    dataAddress: '127.0.0.1',
    dataPort: 9090,
    dcBlock: 0,
    iqCorrection: 0,
    fileRecordName: '',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};

export interface RemoteInputReport {
    centerFrequency?: number;
    sampleRate?: number;
    bufferRWBalance?: number;
    remoteTimestamp?: string;
    minNbBlocks?: number;
    maxNbRecovery?: number;
}

export const REMOTE_INPUT_REPORT_DEFAULT = {
    centerFrequency: 0,
    sampleRate: 0,
    bufferRWBalance: 0,
    remoteTimestamp: '',
    minNbBlocks: 0,
    maxNbRecovery: 0
};
