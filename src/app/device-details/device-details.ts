import { AirspyHFSettings } from "./airspyhf/airspyhf";
import { RTLSDRSettings } from "./rtlsdr/rtlsdr";
import { TestSourceSettings } from "./testsource/testsource";
import { HackRFInputSettings } from "./hackrf-input/hackrf-input";
import { HackRFOutputSettings } from "./hackrf-output/hackrf-output";

export interface DeviceSettings {
    deviceHwType: string,
    tx: number,
    airspyHFSettings?: AirspyHFSettings,
    hackRFInputSettings?: HackRFInputSettings,
    hackRFOutputSettings?: HackRFOutputSettings,
    rtlSdrSettings?: RTLSDRSettings,
    testSourceSettings?: TestSourceSettings
}

export interface DeviceReport {
    deviceHwType: string,
    tx: number,
    rtlSdrReport?: any
}