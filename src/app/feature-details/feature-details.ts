import { AISSettings } from './ais/ais';
import { GS232ControllerReport, GS232ControllerSettings } from './gs232-controller/gs232-controller';
import { SatelliteTrackerSettings } from './satellite-tracker/satellite-tracker';

export interface FeatureSettings {
    featureType: string;
    AISSettings?: AISSettings;
    GS232ControllerSettings?: GS232ControllerSettings;
    SatelliteTrackerSettings?: SatelliteTrackerSettings;
}

export interface FeatureReport {
    featureType: string;
    GS232ControllerReport?: GS232ControllerReport;
}
