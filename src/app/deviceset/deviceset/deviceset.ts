import { Device } from '../device/device';
import { Channel } from '../channel/channel';

export interface DeviceSet {
    samplingDevice: Device,
    channelcount: number,
    channels?: [Channel]
  }