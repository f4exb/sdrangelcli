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

export const CHANNEL2_MOCK = {
  deltaFrequency: -280000,
  id: "NFMDemod",
  index: 0,
  title: "Antibes",
  uid: 1531531532136703
}

export const CHANNEL3_MOCK = {
  deltaFrequency: -154900,
  id: "DSDDemod",
  index: 1,
  title: "F6GLS-R",
  uid: 1531531532183734
}

export const CHANNEL4_MOCK = {
  deltaFrequency: 145000,
  id: "NFMDemod",
  index: 2,
  title: "R1 Var",
  uid: 1531531532203338
}

export const CHANNEL5_MOCK = {
  deltaFrequency: 195000,
  id: "NFMDemod",
  index: 3,
  title: "R3 Agel",
  uid: 1531531532205329
}

export const CHANNEL_TX_MOCK = {
  deltaFrequency: 10000,
  id: "AMMod",
  index: 0,
  title: "AM Modulator",
  uid: 1531644349379931  
}