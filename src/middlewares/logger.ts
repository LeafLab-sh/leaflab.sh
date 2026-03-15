import { defineMiddleware } from "astro:middleware";
import pino from "pino";
import { LogEvent } from "../utils/log_events";

const logger = pino({ level: "info", browser: { asObject: true } });

export const loggerMiddleware = defineMiddleware(async (context, next) => {
  context.locals.logger = logger;
  const url = new URL(context.request.url);
  logger.info({
    event: LogEvent.REQUEST,
    message: "User accessed " + url.pathname,
    method: context.request.method,
    path: url.pathname,
  });
  return next();
});
