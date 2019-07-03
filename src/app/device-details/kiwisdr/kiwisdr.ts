export interface KiwiSDRSettings {
  gain?: number;
  useAGC?: number; // bool
  dcBlock?: number; // bool
  centerFrequency?: number;
  serverAddress?: string;
  fileRecordName?: string;
  useReverseAPI: number;
  reverseAPIDeviceIndex: number;
  reverseAPIAddress: string;
  reverseAPIPort: number;
}

export const KIWISDR_SETTINGS_DEFAULT = {
  centerFrequency: 14200,
  gain: 20,
  useAGC: 1,
  dcBlock: 0,
  serverAddress: '127.0.0.1:8073',
  fileRecordName: '',
  useReverseAPI: 0,
  reverseAPIDeviceIndex: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIPort: 8888
};

export interface KiwiSDRReport {
  status: number; // 0 for Idle, 1 for Connecting, 2 for Connected, 3 for Error, 4 for Disconnected
}

export const KIWISDR_REPORT_DEFAULT = {
  status: 0
};
