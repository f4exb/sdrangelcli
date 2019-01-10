export interface AudioInputDevice {
    name: string;
    index: number;
    sampleRate: number;
    isSystemDefault: number;
    defaultUnregistered: number;
    volume: number;
}

export interface AudioOutputDevice {
    name: string;
    index: number;
    sampleRate: number;
    isSystemDefault?: number;
    defaultUnregistered: number;
    copyToUDP: number;
    udpUsesRTP: number;
    udpChannelMode: number;
    udpAddress: string;
    udpPort: number;
}

export interface AudioDevices {
    nbInputDevices: number;
    inputDevices?: AudioInputDevice[];
    nbOutputDevices: number;
    outputDevices?: AudioOutputDevice[];
}

export const AUDIO_DEVICES_DEFAULT = {
    nbInputDevices: 0,
    nbOutputDevices: 0
};

export const AUDIO_OUT_DEVICE_MOCK = {
    copyToUDP: 0,
    defaultUnregistered: 0,
    index: -1,
    name: 'System default device',
    sampleRate: 48000,
    udpAddress: '192.168.0.38',
    udpChannelMode: 2,
    udpPort: 9998,
    udpUsesRTP: 1
};

export const AUDIO_IN_DEVICE_MOCK = {
    defaultUnregistered: 0,
    index: -1,
    isSystemDefault: 0,
    name: 'System default device',
    sampleRate: 48000,
    volume: 0.15000000596046448
};

export const AUDIO_DEVICES_MOCK = {
    inputDevices: [
        {
          defaultUnregistered: 0,
          index: -1,
          isSystemDefault: 0,
          name: 'System default device',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 0,
          isSystemDefault: 0,
          name: 'pulse',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 1,
          isSystemDefault: 0,
          name: 'default',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 2,
          isSystemDefault: 0,
          name: 'sysdefault:CARD=PCH',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 3,
          isSystemDefault: 0,
          name: 'front:CARD=PCH,DEV=0',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 4,
          isSystemDefault: 0,
          name: 'dmix:CARD=PCH,DEV=0',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 5,
          isSystemDefault: 0,
          name: 'dsnoop:CARD=PCH,DEV=0',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 6,
          isSystemDefault: 0,
          name: 'hw:CARD=PCH,DEV=0',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 7,
          isSystemDefault: 0,
          name: 'plughw:CARD=PCH,DEV=0',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 8,
          isSystemDefault: 1,
          name: 'alsa_input.pci-0000_00_1f.3.analog-stereo',
          sampleRate: 48000,
          volume: 0.15000000596046448
        },
        {
          defaultUnregistered: 1,
          index: 9,
          isSystemDefault: 0,
          name: 'alsa_output.pci-0000_00_1f.3.analog-stereo.monitor',
          sampleRate: 48000,
          volume: 0.15000000596046448
        }
      ],
      nbInputDevices: 10,
      nbOutputDevices: 20,
      outputDevices: [
        {
          copyToUDP: 0,
          defaultUnregistered: 0,
          index: -1,
          name: 'System default device',
          sampleRate: 48000,
          udpAddress: '192.168.0.38',
          udpChannelMode: 2,
          udpPort: 9998,
          udpUsesRTP: 1
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 0,
          isSystemDefault: 0,
          name: 'pulse',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 1,
          isSystemDefault: 0,
          name: 'default',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 2,
          isSystemDefault: 0,
          name: 'sysdefault:CARD=PCH',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 3,
          isSystemDefault: 0,
          name: 'front:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 4,
          isSystemDefault: 0,
          name: 'surround21:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 5,
          isSystemDefault: 0,
          name: 'surround40:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 6,
          isSystemDefault: 0,
          name: 'surround41:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 7,
          isSystemDefault: 0,
          name: 'surround50:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 8,
          isSystemDefault: 0,
          name: 'surround51:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 9,
          isSystemDefault: 0,
          name: 'surround71:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 10,
          isSystemDefault: 0,
          name: 'iec958:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 11,
          isSystemDefault: 0,
          name: 'dmix:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 12,
          isSystemDefault: 0,
          name: 'dmix:CARD=PCH,DEV=1',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 13,
          isSystemDefault: 0,
          name: 'dsnoop:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 14,
          isSystemDefault: 0,
          name: 'dsnoop:CARD=PCH,DEV=1',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 15,
          isSystemDefault: 0,
          name: 'hw:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 16,
          isSystemDefault: 0,
          name: 'hw:CARD=PCH,DEV=1',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 17,
          isSystemDefault: 0,
          name: 'plughw:CARD=PCH,DEV=0',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 1,
          index: 18,
          isSystemDefault: 0,
          name: 'plughw:CARD=PCH,DEV=1',
          sampleRate: 48000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        },
        {
          copyToUDP: 0,
          defaultUnregistered: 0,
          index: 19,
          isSystemDefault: 1,
          name: 'alsa_output.pci-0000_00_1f.3.analog-stereo',
          sampleRate: 8000,
          udpAddress: '127.0.0.1',
          udpChannelMode: 0,
          udpPort: 9998,
          udpUsesRTP: 0
        }
      ]
};
