export interface FreqTrackerSettings {
  inputFrequencyOffset?: number;
  rfBandwidth?: number;
  log2Decim?: number;
  squelch?: number;
  rgbColor?: number;
  title?: string;
  alphaEMA?: number;
  tracking?: number; // bool
  trackerType?: number; // TrackerType
  pllPskOrder?: number;
  rrc?: number; // bool
  rrcRolloff?: number;
  squelchGate?: number;
  useReverseAPI?: number; // bool
  reverseAPIAddress?: string;
  reverseAPIPort?: number;
  reverseAPIDeviceIndex?: number;
  reverseAPIChannelIndex?: number;
}

export const FREQTRACKER_SETTINGS_DEFAULT = {
  inputFrequencyOffset: 0,
  rfBandwidth: 6000,
  log2Decim: 0,
  squelch: -40,
  m_rgbColor: -3607486, // RGB: 200, 244, 66 (200*65536 + 244*256 + 66 signed)
  title: 'Frequency Tracker',
  alphaEMA: 0.1,
  tracking: 0,
  trackerType: 1, // FLL
  pllPskOrder: 2, // BPSK
  rrc: 0,
  rrcRolloff: 35,
  squelchGate: 50,
  useReverseAPI: 0,
  reverseAPIAddress: '127.0.0.1',
  reverseAPIPort: 8888,
  reverseAPIDeviceIndex: 0,
  reverseAPIChannelIndex: 0
};

export interface FreqTrackerReport {
  channelPowerDb: number;
  squelch: number; // bool
  sampleRate: number;
  channelSampleRate: number;
}

export const FREQTRACKER_REPORT_DEFAULT = {
  channelPowerDb: -40,
  squelch: 0,
  sampleRate: 48000,
  channelSampleRate: 48000
};
