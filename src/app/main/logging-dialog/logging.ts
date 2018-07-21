export interface Logging {
    consoleLevel: string;
    dumpToFile: number;
    fileLevel?: string;
    fileName?: string;
}

export const LOGGING_DEFAULT = {
    consoleLevel: "debug",
    dumpToFile: 0
}