export interface AvailableFeature {
    id: string;
    idURI: string;
    index: number;
    name: string;
    version: string;
}

export interface AvailableFeatures {
    featurecount: number;
    features: AvailableFeature[];
}

export interface NewFeature {
    featureType: string;
}

export const AVAILABLE_FEATURES_MOCK = {
    featurecount: 6,
    features: [
      {
        id: 'AFC',
        idURI: 'sdrangel.feature.afc',
        index: 0,
        name: 'AFC',
        version: '6.4.0'
      },
      {
        id: 'AIS',
        idURI: 'sdrangel.feature.ais',
        index: 1,
        name: 'AIS',
        version: '6.12.1'
      },
      {
        id: 'APRS',
        idURI: 'sdrangel.feature.aprs',
        index: 2,
        name: 'APRS',
        version: '6.8.0'
      },
      {
        id: 'SimplePTT',
        idURI: 'sdrangel.feature.simpleptt',
        index: 10,
        name: 'Simple PTT',
        version: '6.5.1'
      },
      {
        id: 'StarTracker',
        idURI: 'sdrangel.feature.startracker',
        index: 11,
        name: 'Star Tracker',
        version: '6.15.0'
      },
      {
        id: 'VORLocalizer',
        idURI: 'sdrangel.feature.vorlocalizer',
        index: 12,
        name: 'VOR Localizer',
        version: '6.10.0'
      }
    ]
};
