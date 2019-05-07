import { AirspyHFSettings } from './airspyhf/airspyhf';
import { RTLSDRSettings } from './rtlsdr/rtlsdr';
import { TestSourceSettings } from './testsource/testsource';
import { HackRFInputSettings } from './hackrf-input/hackrf-input';
import { HackRFOutputSettings } from './hackrf-output/hackrf-output';
import { LimeSDRInputSettings, LimeSDRInputReport } from './limesdr-input/limesdr-input';
import { LimeSDROutputSettings, LimeSDROutputReport } from './limesdr-output/limesdr-output';
import { PlutoSDRInputSettings, PlutoSDRInputReport } from './plutosdr-input/plutosdr-input';
import { PlutoSDROutputReport, PlutoSDROutputSettings } from './plutosdr-output/plutosdr-output';
import { PerseusSettings, PerseusReport } from './perseus/perseus';
import { AirspySettings, AirspyReport } from './airspy/airspy';
import { BladeRF1InputSettings } from './bladerf1-input/bladerf1-input';
import { BladeRF2InputSettings } from './bladerf2-input/bladerf2-input';
import { FCDProSettings } from './fcdpro/fcdpro';
import { FCDProPlusSettings } from './fcdproplus/fcdproplus';
import { XTRXInputSettings, XTRXInputReport } from './xtrx-input/xtrx-input';
import { XTRXOutputReport, XTRXOutputSettings } from './xtrx-output/xtrx-output';
import { BladeRF1OutputSettings } from './bladerf1-output/bladerf1-output';
import { BladeRF2OutputSettings } from './bladerf2-output/bladerf2-output';
import { SDRplaySettings } from './sdrplay/sdrplay';
import { RemoteInputSettings, RemoteInputReport } from './remote-input/remote-input';

export interface DeviceSettings {
    deviceHwType: string;
    direction: number;
    airspySettings?: AirspySettings;
    airspyHFSettings?: AirspyHFSettings;
    bladeRF1InputSettings?: BladeRF1InputSettings;
    bladeRF1OutputSettings?: BladeRF1OutputSettings;
    bladeRF2InputSettings?: BladeRF2InputSettings;
    bladeRF2OutputSettings?: BladeRF2OutputSettings;
    fcdProSettings?: FCDProSettings;
    fcdProPlusSettings?: FCDProPlusSettings;
    hackRFInputSettings?: HackRFInputSettings;
    hackRFOutputSettings?: HackRFOutputSettings;
    limeSdrInputSettings?: LimeSDRInputSettings;
    limeSdrOutputSettings?: LimeSDROutputSettings;
    perseusSettings?: PerseusSettings;
    plutoSdrInputSettings?: PlutoSDRInputSettings;
    plutoSdrOutputSettings?: PlutoSDROutputSettings;
    remoteInputSettings?: RemoteInputSettings;
    rtlSdrSettings?: RTLSDRSettings;
    sdrPlaySettings?: SDRplaySettings;
    testSourceSettings?: TestSourceSettings;
    xtrxInputSettings?: XTRXInputSettings;
    xtrxOutputSettings?: XTRXOutputSettings;
}

export interface DeviceReport {
    deviceHwType: string;
    direction: number;
    airspyReport?: AirspyReport;
    bladeRF2InputReport?: any;
    limeSdrInputReport?: LimeSDRInputReport;
    limeSdrOutputReport?: LimeSDROutputReport;
    perseusReport?: PerseusReport;
    plutoSdrInputReport?: PlutoSDRInputReport;
    plutoSdrOutputReport?: PlutoSDROutputReport;
    remoteInputReport?: RemoteInputReport;
    rtlSdrReport?: any;
    sdrPlayReport?: any;
    xtrxInputReport?: XTRXInputReport;
    xtrxOutputReport?: XTRXOutputReport;
}
