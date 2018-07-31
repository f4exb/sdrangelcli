import { AMDemodSettings } from "./am-demod/am-demod";

export interface ChannelSettings {
    channelType: string,
    tx: number,
    AMDemodSettings?: AMDemodSettings
}