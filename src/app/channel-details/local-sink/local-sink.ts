export interface LocalSinkSettings {
  localDeviceIndex?: number;
  rgbColor?: number;
  title?: string;
  log2Decim?: number;
  filterChainHash?: number;
  useReverseAPI?: number; // bool
  reverseAPIAddress?: string;
  reverseAPIPort?: number;
  reverseAPIDeviceIndex?: number;
  reverseAPIChannelIndex?: number;
}

export const LOCALSINK_SETTINGS_DEFAULT = {
  localDeviceIndex: 0,
  rgbColor: -7601148, // QColor(140, 4, 4).rgb();
  title: 'Local sink',
  log2Decim: 0,
  filterChainHash: 0,
  useReverseAPI: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIPort: 8888,
  reverseAPIDeviceIndex: 0,
  reverseAPIChannelIndex: 0
};
