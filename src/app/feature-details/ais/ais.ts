export interface AISSettings {
    rgbColor: number;
    title: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIFeatureSetIndex?: number;
    reverseAPIFeatureIndex?: number;
}

export const AIS_SETTINGS_DEFAULT = {
    rgbColor: -256,
    title: 'AIS',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIFeatureSetIndex: 0,
    reverseAPIFeatureIndex: 0
};
