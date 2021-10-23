export interface SatelliteDeviceSettings {
    deviceSetIndex: number;
    presetGroup: string;
    presetFrequency: number;
    presetDescription: string;
    doppler?: string[]; // indices (as string) of channels with Doppler control
    startOnAOS: number; // boolean
    stopOnLOS: number; // boolean
    startStopFileSinks: number; // boolean
    frequency: number;
    aosCommand: string;
    losCommand: string;
}

export interface SatelliteDeviceSettingsList {
    satellite: string;
    deviceSettings: SatelliteDeviceSettings[];
}

export interface SatelliteTrackerSettings {
    latitude: number;
    longitude: number;
    heightAboveSeaLevel: number;
    target: string;
    satellites: string[];
    tles: string[];
    dateTime: string;
    minAOSElevation: number;
    minPassElevation: number;
    rotatorMaxAzimuth: number;
    rotatorMaxElevation: number;
    azElUnits: number;
    groundTrackPoints: number;
    dateFormat: string;
    utc: number; // boolean
    updatePeriod: number;
    dopplerPeriod: number;
    predictionPeriod: number;
    passStartTime: string;
    passFinishTime: string;
    defaultFrequency: number;
    drawOnMap: number; // boolean
    autoTarget: number; // boolean
    aosSpeech: string;
    losSpeech: string;
    aosCommand: string;
    losCommand: string;
    deviceSettings: SatelliteDeviceSettingsList[];
    title: string;
    rgbColor: number;
    useReverseAPI?: number; // boolean
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIFeatureSetIndex?: number;
    reverseAPIFeatureIndex?: number;
}

export const SATELLITE_DEVICE_SETTINGS_MOCK = {
    deviceSetIndex: 0,
    presetGroup: 'Sats',
    presetFrequency: 145800000,
    presetDescription: 'ISS',
    startOnAOS: 1,
    stopOnLOS: 1,
    startStopFileSinks: 0,
    frequency: 0,
    aosCommand: '',
    losCommand: ''
};

export const SATELLITE_DEVICE_SETTINGS_LIST_MOCK = {
    satellite: 'ISS',
    deviceSettings: [
        SATELLITE_DEVICE_SETTINGS_MOCK
    ]
};

export const SATELLITE_TRACKER_SETTINGS_MOCK = {
    latitude: 49.01242446899414,
    longitude: 8.41812515258789,
    heightAboveSeaLevel: 0,
    target: 'ISS',
    satellites: [
      'ISS',
      'NOAA 15'
    ],
    tles: [
      'https://db.satnogs.org/api/tle/',
      'https://www.amsat.org/tle/current/nasabare.txt',
      'https://www.celestrak.com/NORAD/elements/goes.txt'
    ],
    dateTime: '',
    minAOSElevation: 5,
    minPassElevation: 15,
    rotatorMaxAzimuth: 450,
    rotatorMaxElevation: 180,
    azElUnits: 1,
    groundTrackPoints: 100,
    dateFormat: 'yyyy/MM/dd',
    utc: 0,
    updatePeriod: 1,
    dopplerPeriod: 10,
    defaultFrequency: 100000000,
    drawOnMap: 1,
    autoTarget: 1,
    aosSpeech: '${name} is visible for ${duration} minutes. Max elevation, ${elevation} degrees.',
    losSpeech: '${name} is no longer visible.',
    aosCommand: '',
    losCommand: '',
    predictionPeriod: 5,
    passStartTime: '00:00:00',
    passFinishTime: '23:59:59',
    deviceSettings: [
        SATELLITE_DEVICE_SETTINGS_LIST_MOCK
    ],
    title: 'Satellite Tracker',
    rgbColor: -2025117,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIFeatureIndex: 0,
    reverseAPIFeatureSetIndex: 0,
};

export interface SatelliteTrackerReport {
    runningState: number; // Feature::FeatureState
}

export const SATELLITE_TRACKER_REPORT_MOCK = {
    runningState: 1
};

export interface SatelliteTrackerActions {
    run: number; // boolean
}

export const SATELLITE_TRACKER_ACTIONS_MOCK = {
    run: 0
};
