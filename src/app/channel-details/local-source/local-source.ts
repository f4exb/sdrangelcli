export interface LocalSourceSettings {
  localDeviceIndex?: number;
  rgbColor?: number;
  title?: string;
  log2Interp?: number;
  filterChainHash?: number;
  useReverseAPI?: number; // bool
  reverseAPIAddress?: string;
  reverseAPIPort?: number;
  reverseAPIDeviceIndex?: number;
  reverseAPIChannelIndex?: number;
}

export const LOCALSOURCE_SETTINGS_DEFAULT = {
  localDeviceIndex: 0,
  rgbColor: -7601148, // QColor(140, 4, 4).rgb();
  title: 'Local Source',
  log2Interp: 0,
  filterChainHash: 0,
  useReverseAPI: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIPort: 8888,
  reverseAPIDeviceIndex: 0,
  reverseAPIChannelIndex: 0
};
