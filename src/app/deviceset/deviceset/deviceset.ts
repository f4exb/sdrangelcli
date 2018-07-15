import { Device, DEVICE_MOCK1, DEVICE_MOCK2, DEVICE_TX_MOCK } from '../device/device';
import { Channel, CHANNEL0_MOCK, CHANNEL1_MOCK, CHANNEL2_MOCK, CHANNEL3_MOCK, CHANNEL4_MOCK, CHANNEL5_MOCK, CHANNEL_TX_MOCK } from '../channel/channel';

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
  samplingDevice: DEVICE_MOCK1
}

export const DEVICESET_MOCK_WITHOUT_CHANNELS = {
  channelcount: 0,
  samplingDevice: DEVICE_MOCK1
}

export const DEVICESET_MOCK1 = {
  samplingDevice: DEVICE_MOCK2,
  channelcount: 4,
  channels: [
    CHANNEL2_MOCK,
    CHANNEL3_MOCK,
    CHANNEL4_MOCK,
    CHANNEL5_MOCK
  ]
}

export const DEVICESET_TX_MOCK = {
  samplingDevice: DEVICE_TX_MOCK,
  channelcount: 1,
  channels: [
    CHANNEL_TX_MOCK
  ]
}
