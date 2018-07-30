import { ChannelDetailsModule } from './channel-details.module';

describe('ChannelDetailsModule', () => {
  let channelDetailsModule: ChannelDetailsModule;

  beforeEach(() => {
    channelDetailsModule = new ChannelDetailsModule();
  });

  it('should create an instance', () => {
    expect(channelDetailsModule).toBeTruthy();
  });
});
