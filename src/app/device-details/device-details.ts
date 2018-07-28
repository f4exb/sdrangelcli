import { AirspyHFSettings } from "./airspyhf/airspyhf";

export interface DeviceSettings {
    deviceHwType: string,
    tx: number,
    airspyHFSettings?: AirspyHFSettings
}