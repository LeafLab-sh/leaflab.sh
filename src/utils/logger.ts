export enum LogEvent {
  REQUEST = "request",
  CF_ACCESS_NOT_CONFIGURED = "cf_access_not_configured",
  CF_ACCESS_JWT_NOT_PROVIDED = "cf_access_jwt_not_provided",
  CF_ACCESS_VALIDATION_SUCCESS = "cf_access_validation_success",
  CF_ACCESS_JWT_INVALID = "cf_access_jwt_invalid",
}

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

import { LOG_LEVEL } from "astro:env/server";

const LEVELS: Record<string, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

function log(level: string, data: LogData, isError = false): void {
  const min = LEVELS[LOG_LEVEL.toUpperCase()] ?? LEVELS.INFO;
  if ((LEVELS[level] ?? 0) < min) return;

  const { message, ...rest } = data;
  const output = JSON.stringify({
    level: level.toUpperCase(),
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
  debug: (data) => log("DEBUG", data),
  info: (data) => log("INFO", data),
  warn: (data) => log("WARN", data),
  error: (data) => log("ERROR", data, true),
  fatal: (data) => log("FATAL", data, true),
};
