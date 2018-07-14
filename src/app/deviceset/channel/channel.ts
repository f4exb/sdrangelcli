export interface Channel {
    deltaFrequency: number,
    id: string,
    index: number,
    title: string,
    uid: number        
  }

export const CHANNEL_MOCK = {
  deltaFrequency: 7500,
  id: "SSBDemod",
  index: 0,
  title: "Ch.0",
  uid: 1531554506284296
}