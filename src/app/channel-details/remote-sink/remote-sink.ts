export interface RemoteSinkSettings {
    dataAddress?: string;
    dataPort?: number;
    nbFECBlocks?: number;
    txDelay?: number;
    rgbColor?: number;
    title?: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
    reverseAPIChannelIndex?: number;
}

export const REMOTE_SINK_SETTINGS_DEFAULT = {
    dataAddress: '127.0.0.1',
    dataPort: 9090,
    nbFECBlocks: 0,
    txDelay: 0,
    rgbColor: -7601148,
    title: 'Remote channel sink',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0,
    reverseAPIChannelIndex: 0
};
