import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { validateCfAccessJwt } from "./middlewares/cloudflare-access";

export const onRequest = defineMiddleware(async (context, next) => {
  const errorResponse = await validateCfAccessJwt(context.request, env);
  return errorResponse ?? next();
});
