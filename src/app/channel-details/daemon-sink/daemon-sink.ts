export interface DaemonSinkSettings {
    dataAddress: string,
    dataPort: number,
    nbFECBlocks: number,
    txDelay: number,
    rgbColor: number,
    title: string
}

export const DAEMON_SINK_SETTINGS_DEFAULT = {
    dataAddress: "127.0.0.1",
    dataPort: 9090,
    nbFECBlocks: 0,
    txDelay: 0,
    rgbColor: -7601148,
    title: "Daemon channel sink"
}