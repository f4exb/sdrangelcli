import { CommonComponentsModule } from './common-components.module';

describe('CommonComponentsModule', () => {
  let commonComponentsModule: CommonComponentsModule;

  beforeEach(() => {
    commonComponentsModule = new CommonComponentsModule();
  });

  it('should create an instance', () => {
    expect(commonComponentsModule).toBeTruthy();
  });
});
