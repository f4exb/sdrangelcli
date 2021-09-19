import { FeatureDetailsModule } from './feature-details.module';

describe('FeatureDetailsModule', () => {
  let featureDetailsModule: FeatureDetailsModule;

  beforeEach(() => {
    featureDetailsModule = new FeatureDetailsModule();
  });

  it('should create an instance', () => {
    expect(featureDetailsModule).toBeTruthy();
  });
});
