export interface XTRXInputSettings {
    centerFrequency?: number;
    devSampleRate?: number;
    log2HardDecim?: number;
    dcBlock?: number; // bool
    iqCorrection?: number; // bool
    log2SoftDecim?: number;
    lpfBW?: number;
    gain?: number;
    ncoEnable?: number; // bool
    ncoFrequency?: number;
    antennaPath?: number; // xtrx_antenna_t
    gainMode?: number; // GainMode
    lnaGain?: number;
    tiaGain?: number;
    pgaGain?: number;
    extClock?: number; // bool
    extClockFreq?: number;
    pwrmode?: number;
    fileRecordName?: string;
    useReverseAPI?: number; // bool
    reverseAPIAddress?: string;
    reverseAPIPort?: number;
    reverseAPIDeviceIndex?: number;
}

export const XTRX_INPUT_SETTINGS_DEFAULT = {
    centerFrequency: 435000 * 1000,
    devSampleRate: 5000000,
    log2HardDecim: 1,
    dcBlock: 0,
    iqCorrection: 0,
    log2SoftDecim: 0,
    lpfBW: 4500000,
    gain: 50,
    ncoEnable: 0,
    ncoFrequency: 0,
    antennaPath: 0,
    gainMode: 0,
    lnaGain: 15,
    tiaGain: 2,
    pgaGain: 16,
    extClock: 0,
    extClockFreq: 0,
    pwrmode: 1,
    fileRecordName: '',
    useReverseAPI: 0,
    reverseAPIAddress: '127.0.0.1',
    reverseAPIPort: 8888,
    reverseAPIDeviceIndex: 0
};

export interface XTRXInputReport {
    success?: number; // bool
    fifoSize?: number;
    fifoFill?: number;
    temperature?: number;
    gpsLock?: number; // bool
}

export const XTRX_INPUT_REPORT_DEFAULT = {
    success: 0,
    fifoSize: 65536,
    fifoFill: 0,
    temperature: 0,
    gpsLock: 0
};
