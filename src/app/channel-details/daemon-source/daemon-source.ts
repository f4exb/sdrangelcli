export interface SDRDaemonChannelSourceSettings {
    dataAddress: string,
    dataPort: number,
    rgbColor: number,
    title: string
}

export const DAEMON_SOURCE_SETTINGS_DEFAULT = {
    dataAddress: "127.0.0.1",
    dataPort: 9090,
    rgbColor: -7601148,
    title: "Daemon channel source"
}

export interface SDRDaemonChannelSourceReport {
    correctableErrorsCount: number,
    queueLength: number,
    queueSize: number,
    samplesCount: number,
    tvSec: number,
    tvUSec: number,
    uncorrectableErrorsCount: number
}

export const DAEMON_SOURCE_REPORT_DEFAULT = {
    correctableErrorsCount: 0,
    queueLength: 0,
    queueSize: 10,
    samplesCount: 0,
    tvSec: 1535770914,
    tvUSec: 340834,
    uncorrectableErrorsCount: 0
}