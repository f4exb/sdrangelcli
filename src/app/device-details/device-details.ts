import { AirspyHFSettings } from "./airspyhf/airspyhf";
import { RTLSDRSettings } from "./rtlsdr/rtlsdr";
import { TestSourceSettings } from "./testsource/testsource";
import { HackRFInputSettings } from "./hackrf-input/hackrf-input";
import { HackRFOutputSettings } from "./hackrf-output/hackrf-output";
import { LimeSDRInputSettings, LimeSDRInputReport } from "./limesdr-input/limesdr-input";

export interface DeviceSettings {
    deviceHwType: string,
    tx: number,
    airspyHFSettings?: AirspyHFSettings,
    hackRFInputSettings?: HackRFInputSettings,
    hackRFOutputSettings?: HackRFOutputSettings,
    limeSdrInputSettings?: LimeSDRInputSettings,
    rtlSdrSettings?: RTLSDRSettings,
    testSourceSettings?: TestSourceSettings
}

export interface DeviceReport {
    deviceHwType: string,
    tx: number,
    limeSdrInputReport?: LimeSDRInputReport,
    rtlSdrReport?: any
}