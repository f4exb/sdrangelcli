export interface GS232ControllerSettings {
    azimuth: number;         //  Target azimuth in degrees (0-450)
    elevation: number;       // Target elevation in degrees (0-180)
    serialPort: string;      // The serial port the GS-232 controller is connected to
    baudRate: number;        // The baud rate to use for the serial connection to the GS-232 controller
    track: number;           // Track a target where azimuth and elevation are determined by another plugin (1 for yes, 0 for no)
    source: string;          // Identifier of the channel or feature plugin providing target azimuth and elevation (E.g. R0:0 ADSBDemod)
    azimuthOffset: number;   // Azimuth offset in degrees
    elevationOffset: number; // Elevation offset in degrees
    azimuthMin: number;      // Minimum azimuth the controller will output
    azimuthMax: number;      // Maximum azimuth the controller will output
    elevationMin: number;    // Minimum elevation the controller will output
    elevationMax: number;    // Maximum elevation the controller will output
    tolerance: number;       // Tolerance in degrees
    protocol: number;        // (0 GS-232, 1 SPID rot2prog)
    title: string;
    rgbColor: number;
    useReverseAPI: number;   // Synchronize with reverse API (1 for yes, 0 for no)
    reverseAPIAddress: string;
    reverseAPIPort: number;
    reverseAPIFeatureSetIndex: number;
    reverseAPIFeatureIndex: number;
}

export const GS232_CONTROLLER_SETTINGS_MOCK = {
    azimuth: 0,
    elevation: 0,
    serialPort: '/dev/ttyACM0',
    baudRate: 115200,
    track: 0,
    source: 'R0:0 ADSBDemod',
    azimuthOffset: 0,
    elevationOffset: 0,
    azimuthMin: 0,
    azimuthMax: 450,
    elevationMin: 0,
    elevationMax: 180,
    tolerance: 5,
    protocol: 0,
    title: 'GS232 Controller',
    rgbColor: -2025117,
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIFeatureIndex: 0,
    reverseAPIFeatureSetIndex: 0
};

export interface GS232ControllerReport {
    sources: string[];
    serialPorts: string[];
    targetAzimuth: number;
    targetElevation: number;
    currentAzimuth: number;
    currentElevation: number;
    onTarget: number; // boolean
}

export const GS232_CONTROLLER_REPORT_MOCK = {
    sources: [
        'F0:1 SatelliteTracker',
        'R0:2 ADSBDemod'
    ],
    serialPorts: [
        'ttyUSB0',
        'ttyUSB1'
    ],
    targetAzimuth: 0,
    targetElevation: 0,
    currentAzimuth: 0,
    currentElevation: 0,
    onTarget: 1
};
