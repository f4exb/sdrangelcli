import { Feature, FEATURE0_MOCK } from '../../featureset/feature/feature';
import { DeviceSet, DEVICESET_MOCK_WITH_CHANNELS, DEVICESET_MOCK1, DEVICESET_TX_MOCK } from '../../deviceset/deviceset/deviceset';

export interface InstanceSummary {
    appname: string;
    architecture: string;
    dspRxBits: number;
    dspTxBits: number;
    os: string;
    pid: number;
    qtVersion: string;
    version: string;
    devicesetlist: {
        devicesetcount: number,
        devicesetfocus?: number,
        deviceSets?: [DeviceSet]
    };
    featureset: {
        featurecount: number,
        features?: [Feature]
    };
    logging: {
        consoleLevel: string,
        dumpToFile: number,
        fileLevel?: string,
        fileName?: string
    };
  }

  export const INSTANCE_SUMMARY_DEFAULT = {
    appname: 'Default',
    architecture: 'none',
    devicesetlist: {
      devicesetcount: 0
    },
    featureset: {
      featurecount: 0
    },
    dspRxBits: 24,
    dspTxBits: 16,
    logging: {
      consoleLevel: 'debug',
      dumpToFile: 0
    },
    os: 'None',
    pid: 0,
    qtVersion: '0.0.0',
    version: '0.0.0'
  };

  export const INSTANCE_SUMMARY_MOCK1 = {
    appname: 'SDRangel',
    architecture: 'x86_64',
    devicesetlist: {
      deviceSets: [
        DEVICESET_MOCK_WITH_CHANNELS
      ],
      devicesetcount: 1,
      devicesetfocus: 0
    },
    featureset: {
      featurecount: 0
    },
    dspRxBits: 24,
    dspTxBits: 16,
    logging: {
      consoleLevel: 'debug',
      dumpToFile: 0
    },
    os: 'Ubuntu 18.04 LTS',
    pid: 8958,
    qtVersion: '5.9.5',
    version: '4.0.3'
  };

  export const INSTANCE_SUMMARY_MOCK_EMPTY = {
    appname: 'SDRangelSrv',
    architecture: 'x86_64',
    devicesetlist: {
      devicesetcount: 0
    },
    featureset: {
      featurecount: 0
    },
    dspRxBits: 24,
    dspTxBits: 16,
    logging: {
      consoleLevel: 'debug',
      dumpToFile: 0
    },
    os: 'Ubuntu 18.04 LTS',
    pid: 12603,
    qtVersion: '5.9.5',
    version: '4.0.3'
  };

  export const INSTANCE_SUMMARY_MOCK_MANY = {
    appname: 'SDRangel',
    architecture: 'x86_64',
    devicesetlist: {
      deviceSets: [
        DEVICESET_MOCK_WITH_CHANNELS,
        DEVICESET_MOCK1,
        DEVICESET_TX_MOCK
      ],
      devicesetcount: 3,
      devicesetfocus: 0
    },
    featureset: {
      featurecount: 1,
      features: [
        FEATURE0_MOCK
      ]
    },
    dspRxBits: 24,
    dspTxBits: 16,
    logging: {
      consoleLevel: 'debug',
      dumpToFile: 0
    },
    os: 'Ubuntu 18.04 LTS',
    pid: 8958,
    qtVersion: '5.9.5',
    version: '4.0.3'
  };
