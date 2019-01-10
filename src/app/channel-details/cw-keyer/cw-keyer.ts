export interface CWKeyerSettings {
    loop: number;
    mode: number;
    sampleRate: number;
    text: string;
    wpm: number;
}

export const CWKEYER_SETTINGS_DEFAULT = {
    loop: 0,
    mode: 0,
    sampleRate: 48000,
    text: 'VVV DE F4EXB   ',
    wpm: 13
};
