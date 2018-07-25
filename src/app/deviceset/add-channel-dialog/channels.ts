export interface AvailableChannel {
    id: string,
    idURI: string,
    index: number,
    name: string,
    tx: number,
    version: string
}

export interface AvailableChannels {
    channelcount: number,
    channels: AvailableChannel[]
}

export interface NewChannel {
    channelType: string,
    tx: number
}

export const AVAILABLE_CHANNELS_MOCK = {
    channelcount: 7,
    channels: [
      {
        id: "AMDemod",
        idURI: "sdrangel.channel.amdemod",
        index: 0,
        name: "AM Demodulator",
        tx: 0,
        version: "3.14.7"
      },
      {
        id: "BFMDemod",
        idURI: "sdrangel.channel.bfm",
        index: 1,
        name: "Broadcast FM Demodulator",
        tx: 0,
        version: "4.0.2"
      },
      {
        id: "DSDDemod",
        idURI: "sdrangel.channel.dsddemod",
        index: 2,
        name: "DSD Demodulator",
        tx: 0,
        version: "4.0.1"
      },
      {
        id: "NFMDemod",
        idURI: "sdrangel.channel.nfmdemod",
        index: 3,
        name: "NFM Demodulator",
        tx: 0,
        version: "3.14.6"
      },
      {
        id: "SSBDemod",
        idURI: "sdrangel.channel.ssbdemod",
        index: 4,
        name: "SSB Demodulator",
        tx: 0,
        version: "4.0.2"
      },
      {
        id: "UDPSrc",
        idURI: "sdrangel.channel.udpsrc",
        index: 5,
        name: "UDP Channel Source",
        tx: 0,
        version: "4.0.2"
      },
      {
        id: "WFMDemod",
        idURI: "sdrangel.channel.wfmdemod",
        index: 6,
        name: "WFM Demodulator",
        tx: 0,
        version: "4.0.0"
      }
    ]
}