export interface RemoteSourceSettings {
    dataAddress: string;
    dataPort: number;
    rgbColor: number;
    title: string;
}

export const REMOTE_SOURCE_SETTINGS_DEFAULT = {
    dataAddress: '127.0.0.1',
    dataPort: 9090,
    rgbColor: -7601148,
    title: 'Remote channel source'
};

export interface RemoteSourceReport {
    centerFreq: number;
    correctableErrorsCount: number;
    nbFECBlocks: number;
    nbOriginalBlocks: number;
    queueLength: number;
    queueSize: number;
    sampleRate: number;
    samplesCount: number;
    tvSec: number;
    tvUSec: number;
    uncorrectableErrorsCount: number;
}

export const REMOTE_SOURCE_REPORT_DEFAULT = {
    centerFreq: 434900,
    correctableErrorsCount: 0,
    nbFECBlocks: 8,
    nbOriginalBlocks: 128,
    queueLength: 18,
    queueSize: 32,
    sampleRate: 75000,
    samplesCount: 101481494,
    tvSec: 1535913707,
    tvUSec: 667575,
    uncorrectableErrorsCount: 0
};
