export interface SigMFFileSinkSettings {
    inputFrequencyOffset: number;
    fileRecordName: string;
    rgbColor: number;
    title: string;
    log2Decim: number;
    spectrumSquelchMode: number; // boolean
    spectrumSquelch: number;
    preRecordTime: number;
    squelchPostRecordTime: number;
    squelchRecordingEnable: number; // boolean
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const SIGMF_FILESINK_SETTINGS_DEFAULT = {
    inputFrequencyOffset: 0,
    fileRecordName: '',
    rgbColor: -256,
    title: 'SigMF File Sink',
    log2Decim: 0,
    spectrumSquelchMode: 0,
    spectrumSquelch: -30,
    preRecordTime: 0,
    squelchPostRecordTime: 0,
    squelchRecordingEnable: 0,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};

export interface SigMFFileSinkReport {
    spectrumSquelch: number; // boolean
    spectrumMax: number;
    sinkSampleRate: number;
    channelSampleRate: number;
    recording: number; // boolean
    recordTimeMs: number;
    recordSize: number;
    recordCaptures: number;
}

export const SIGMF_FILESINK_REPORT_DEFAULT = {
    spectrumSquelch: 0,
    spectrumMax: 0,
    sinkSampleRate: 48000,
    channelSampleRate: 48000,
    recording: 0,
    recordTimeMs: 0,
    recordSize: 0,
    recordCaptures: 0
};

export interface SigMFFileSinkActions {
    record: number; // boolean
}

export const SIGMF_FILESINK_ACTIONS_DEFAULT  = {
    record: 0
};
