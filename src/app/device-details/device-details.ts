import { AirspyHFSettings } from "./airspyhf/airspyhf";
import { RTLSDRSettings } from "./rtlsdr/rtlsdr";
import { TestSourceSettings } from "./testsource/testsource";
import { HackRFInputSettings } from "./hackrf-input/hackrf-input";
import { HackRFOutputSettings } from "./hackrf-output/hackrf-output";
import { LimeSDRInputSettings, LimeSDRInputReport } from "./limesdr-input/limesdr-input";
import { LimeSDROutputSettings, LimeSDROutputReport } from "./limesdr-output/limesdr-output";
import { PlutoSDRInputSettings, PlutoSDRInputReport } from "./plutosdr-input/plutosdr-input";
import { PlutoSDROutputReport, PlutoSDROutputSettings } from "./plutosdr-output/plutosdr-output";
import { PerseusSettings, PerseusReport } from "./perseus/perseus";
import { AirspySettings, AirspyReport } from "./airspy/airspy";
import { BladeRF1Settings } from "./bladerf1-input/bladerf1-input";
import { BladeRF2Settings } from "./bladerf2-input/bladerf2-input";

export interface DeviceSettings {
    deviceHwType: string,
    tx: number,
    airspySettings?: AirspySettings,
    airspyHFSettings?: AirspyHFSettings,
    bladeRF1InputSettings?: BladeRF1Settings,
    bladeRF2InputSettings?: BladeRF2Settings,
    hackRFInputSettings?: HackRFInputSettings,
    hackRFOutputSettings?: HackRFOutputSettings,
    limeSdrInputSettings?: LimeSDRInputSettings,
    limeSdrOutputSettings?: LimeSDROutputSettings,
    perseusSettings?: PerseusSettings,
    plutoSdrInputSettings?: PlutoSDRInputSettings,
    plutoSdrOutputSettings?: PlutoSDROutputSettings,
    rtlSdrSettings?: RTLSDRSettings,
    testSourceSettings?: TestSourceSettings
}

export interface DeviceReport {
    deviceHwType: string,
    tx: number,
    airspyReport?: AirspyReport,
    bladeRF2InputReport?: any,
    limeSdrInputReport?: LimeSDRInputReport,
    limeSdrOutputReport?: LimeSDROutputReport,
    perseusReport?: PerseusReport,
    plutoSdrInputReport?: PlutoSDRInputReport,
    plutoSdrOutputReport?: PlutoSDROutputReport,
    rtlSdrReport?: any
}