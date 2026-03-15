import { LogEvent } from "./log_events";

interface LogData {
  event: LogEvent;
  message: string;
  [key: string]: unknown;
}

export interface Logger {
  debug(data: LogData): void;
  info(data: LogData): void;
  warn(data: LogData): void;
  error(data: LogData): void;
  fatal(data: LogData): void;
}

function log(level: string, data: LogData, isError = false): void {
  const { message, ...rest } = data;
  const output = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    message,
    ...rest,
  });
  if (isError) {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger: Logger = {
  debug: (data) => log("debug", data),
  info: (data) => log("info", data),
  warn: (data) => log("warn", data),
  error: (data) => log("error", data, true),
  fatal: (data) => log("fatal", data, true),
};
