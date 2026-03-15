import { defineMiddleware } from "astro:middleware";
import { logger } from "../utils/logger";
import { LogEvent } from "../utils/log_events";

export const loggerMiddleware = defineMiddleware(async (context, next) => {
  context.locals.logger = logger;
  const url = new URL(context.request.url);
  logger.info({
    event: LogEvent.REQUEST,
    message: "User accessed " + url.pathname,
  });
  return next();
});
