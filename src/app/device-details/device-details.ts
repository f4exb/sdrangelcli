import { AirspyHFSettings } from "./airspyhf/airspyhf";
import { RTLSDRSettings } from "./rtlsdr/rtlsdr";
import { TestSourceSettings } from "./testsource/testsource";
import { HackRFInputSettings } from "./hackrf-input/hackrf-input";

export interface DeviceSettings {
    deviceHwType: string,
    tx: number,
    airspyHFSettings?: AirspyHFSettings,
    hackRFInputSettings?: HackRFInputSettings,
    rtlSdrSettings?: RTLSDRSettings,
    testSourceSettings?: TestSourceSettings
}