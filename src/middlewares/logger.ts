import { defineMiddleware } from "astro:middleware";
import { logger } from "../utils/logger";

export const loggerMiddleware = defineMiddleware(async (context, next) => {
  context.locals.logger = logger;
  return next();
});
