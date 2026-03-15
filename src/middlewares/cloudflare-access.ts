import { defineMiddleware } from "astro:middleware";
import {
  CLOUDFLARE_ACCESS_DOMAIN,
  CLOUDFLARE_ACCESS_AUD,
} from "astro:env/server";
import { validateCfAccessJwt } from "../utils/cf-access";

export const cfAccessMiddleware = defineMiddleware(async (context, next) => {
  const errorResponse = await validateCfAccessJwt(
    context.request,
    { CLOUDFLARE_ACCESS_DOMAIN, CLOUDFLARE_ACCESS_AUD },
    context.locals.logger,
  );
  return errorResponse ?? next();
});
