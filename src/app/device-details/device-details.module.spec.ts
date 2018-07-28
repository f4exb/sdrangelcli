import { DeviceDetailsModule } from './device-details.module';

describe('DeviceDetailsModule', () => {
  let deviceDetailsModule: DeviceDetailsModule;

  beforeEach(() => {
    deviceDetailsModule = new DeviceDetailsModule();
  });

  it('should create an instance', () => {
    expect(deviceDetailsModule).toBeTruthy();
  });
});
