export interface RemoteOutputSettings {
  apiAddress?: string;
  apiPort?: number;
  channelIndex?: number; // remote SDRangel instance channel index
  dataAddress?: string;
  dataPort?: number;
  deviceIndex?: number; // remote SDRangel instance deviceset index
  nbFECBlocks?: number;
  reverseAPIAddress?: string;
  reverseAPIDeviceIndex?: number;
  reverseAPIPort?: number;
  useReverseAPI?: number; // bool
}

export const REMOTE_OUTPUT_SETTINGS_DEFAULT = {
  apiAddress: '127.0.0.1',
  apiPort: 9091,
  channelIndex: 0,
  dataAddress: '127.0.0.1',
  dataPort: 9090,
  deviceIndex: 0,
  nbFECBlocks: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIDeviceIndex: 0,
  reverseAPIPort: 8888,
  useReverseAPI: 0
};

export interface RemoteOutputReport {
  centerFrequency: number; // cener frequency of remote (in stream)
  sampleCount: number; // count of samples that have been sent
  sampleRate: number; // sample rate in remote (in stream)
  queueLength: number;
  queueSize: number;
  correctableErrorsCount: number;
  uncorrectableErrorsCount: number;
  tvSec: number;
  tvUSec: number;
}

export const REMOTE_OUTPUT_REPORT_DEFAULT = {
  centerFrequency: 435000000,
  sampleCount: 0,
  sampleRate: 48000,
  queueLength: 2,
  queueSize: 20,
  correctableErrorsCount: 0,
  uncorrectableErrorsCount: 0,
  tvSec: 1535913707,
  tvUSec: 667575
};
