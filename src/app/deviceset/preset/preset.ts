export interface Preset {
    centerFrequency: number,
    name: string,
    type: string
}

export interface PresetGroup {
    groupName: string,
    nbPresets: number,
    presets: Preset[]
}

export interface Presets {
    nbGroups: number,
    groups: PresetGroup[]
}

export interface PresetLoad {
    deviceSetIndex: number,
    preset: {
      groupName: string,
      centerFrequency: number,
      name: string,
      type: string
    }
  }

export const PRESETS_MOCK = {
    nbGroups: 3,
    groups: [
        {
          groupName: "10m",
          nbPresets: 3,
          presets: [
            {
              centerFrequency: 28480000,
              name: "SSB",
              type: "R"
            },
            {
              centerFrequency: 29200000,
              name: "FM and Digi",
              type: "R"
            },
            {
              centerFrequency: 29610000,
              name: "FM",
              type: "R"
            }
          ]
        },
        {
          groupName: "15m",
          nbPresets: 2,
          presets: [
            {
              centerFrequency: 21030000,
              name: "CW",
              type: "R"
            },
            {
              centerFrequency: 21250000,
              name: "SSB",
              type: "R"
            }
          ]
        },
        {
          groupName: "BFM",
          nbPresets: 8,
          presets: [
            {
              centerFrequency: 91500000,
              name: "Cannes Radio",
              type: "R"
            },
            {
              centerFrequency: 94600000,
              name: "Kiss FM",
              type: "R"
            },
            {
              centerFrequency: 94600000,
              name: "SDRdaemon test",
              type: "R"
            },
            {
              centerFrequency: 94700000,
              name: "Kiss FM w scope",
              type: "R"
            },
            {
              centerFrequency: 100700000,
              name: "France Bleue",
              type: "R"
            },
            {
              centerFrequency: 103200000,
              name: "Radio Monaco",
              type: "R"
            },
            {
              centerFrequency: 103400000,
              name: "Frequence K",
              type: "R"
            },
            {
              centerFrequency: 104400000,
              name: "BFM radio",
              type: "R"
            }
          ]
        }
    ]
}