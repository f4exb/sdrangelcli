import { Device, DEVICE_MOCK } from '../device/device';
import { Channel, CHANNEL0_MOCK, CHANNEL1_MOCK } from '../channel/channel';

export interface DeviceSet {
    channelcount: number,
    channels?: Channel[],
    samplingDevice: Device
  }

export const DEVICESET_MOCK_WITH_CHANNELS = {
  channelcount: 2,
  channels: [
    CHANNEL0_MOCK,
    CHANNEL1_MOCK
  ],
  samplingDevice: DEVICE_MOCK
}

export const DEVICESET_MOCK_WITHOUT_CHANNELS = {
  channelcount: 0,
  samplingDevice: DEVICE_MOCK
}