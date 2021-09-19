export interface FeaturePreset {
    description: string;
}

export interface FeaturePresetIdentifier {
    groupName: string;
    description: string;
}

export interface FeaturePresetGroup {
    groupName: string;
    nbPresets: number;
    presets: FeaturePreset[];
}

export interface FeaturePresets {
    nbGroups: number;
    groups: FeaturePresetGroup[];
}

export const FEATURE_PRESETS_DEFAULT = {
    nbGroups: 0,
    groups: []
};

export const FEATURE_PRESET_MOCK = {
  description: 'AIS'
};

export const FEATURE_PRESET_GROUP_MOCK = {
  groupName: 'Maps',
  nbPresets: 2,
  presets: [
    {
      description: 'AIS'
    },
    {
      description: 'ADS-B'
    }
  ]
};

export const FEATURE_PRESETS_MOCK = {
    nbGroups: 3,
    groups: [
        {
          groupName: 'Maps',
          nbPresets: 2,
          presets: [
            {
              description: 'AIS'
            },
            {
              description: 'ADS-B'
            },
          ]
        },
        {
          groupName: 'QO-100',
          nbPresets: 1,
          presets: [
            {
              description: 'Narrowband AFC'
            }
          ]
        },
        {
          groupName: 'Test',
          nbPresets: 3,
          presets: [
            {
              description: 'PTT'
            },
            {
              description: 'PTT1'
            },
            {
              description: 'PTT2'
            },
          ]
        }
    ]
};
