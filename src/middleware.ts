import { sequence } from "astro:middleware";
import { loggerMiddleware } from "./middlewares/logger";
import { cfAccessMiddleware } from "./middlewares/cloudflare-access";

export const onRequest = sequence(loggerMiddleware, cfAccessMiddleware);
