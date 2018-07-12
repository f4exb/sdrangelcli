import { DevicesetModule } from './deviceset.module';

describe('DevicesetModule', () => {
  let devicesetModule: DevicesetModule;

  beforeEach(() => {
    devicesetModule = new DevicesetModule();
  });

  it('should create an instance', () => {
    expect(devicesetModule).toBeTruthy();
  });
});
