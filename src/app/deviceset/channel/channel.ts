export interface Channel {
    deltaFrequency: number,
    id: string,
    index: number,
    title: string,
    uid: number        
  }

export const CHANNEL0_MOCK = {
  deltaFrequency: -26100,
  id: "SSBDemod",
  index: 0,
  title: "Ch.0",
  uid: 1531554506248878
}

export const CHANNEL1_MOCK = {
  deltaFrequency: 7500,
  id: "SSBDemod",
  index: 1,
  title: "Ch.1",
  uid: 1531554506284296
}