import { FeaturesetModule } from './featureset.module';

describe('FeaturesetModule', () => {
  let featuresetModule: FeaturesetModule;

  beforeEach(() => {
    featuresetModule = new FeaturesetModule();
  });

  it('should create an instance', () => {
    expect(featuresetModule).toBeTruthy();
  });
});
