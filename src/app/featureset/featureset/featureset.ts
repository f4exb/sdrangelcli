import { Feature, FEATURE0_MOCK } from '../feature/feature';

export interface FeatureSet {
    featurecount: number;
    features?: Feature[];
}

export const FEATURSET_MOCK_WITH_FEATURES = {
    featurecount: 1,
    features: [
      FEATURE0_MOCK
    ]
  };

  export const FEATURESET_MOCK_WITHOUT_FEATURES = {
    featurecount: 0
  };
