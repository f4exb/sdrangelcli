import { AISSettings } from './ais/ais';
import { SatelliteTrackerSettings } from './satellite-tracker/satellite-tracker';

export interface FeatureSettings {
    featureType: string;
    AISSettings?: AISSettings;
    SatelliteTrackerSettings?: SatelliteTrackerSettings;
}
