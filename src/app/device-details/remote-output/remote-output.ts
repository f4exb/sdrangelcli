export interface RemoteOutputSettings {
  centerFrequency?: number;
  sampleRate?: number;
  txDelay?: number; // minimum delay in ms between two consecutive packets sending
  nbFECBlocks?: number;
  apiAddress?: string;
  apiPort?: number;
  dataAddress?: string;
  dataPort?: number;
  deviceIndex?: number; // remote SDRangel instance deviceset index
  channelIndex?: number; // remote SDRangel instance channel index
  useReverseAPI?: number; // bool
  reverseAPIAddress?: string;
  reverseAPIPort?: number;
  reverseAPIDeviceIndex?: number;
}

export const REMOTE_OUTPUT_SETTINGS_DEFAULT = {
  centerFrequency: 435000000,
  sampleRate: 48000,
  txDelay: 0.35,
  nbFECBlocks: 0,
  apiAddress: '127.0.0.1',
  apiPort: 9091,
  dataAddress: '127.0.0.1',
  dataPort: 9090,
  deviceIndex: 0,
  channelIndex: 0,
  useReverseAPI: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIPort: 8888,
  reverseAPIDeviceIndex: 0
};

export interface RemoteOutputReport {
  bufferRWBalance: number; // ratio off the mid buffer (positive read leads)
  sampleCount: number; // count of samples that have been sent
}

export const REMOTE_OUTPUT_REPORT_DEFAULT = {
  bufferRWBalance: 0,
  sampleCount: 0
};
