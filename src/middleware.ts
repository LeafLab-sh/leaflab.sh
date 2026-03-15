import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { validateCfAccessJwt } from "./middlewares/cloudflare-access";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  console.log(
    JSON.stringify({
      event: "request",
      method: context.request.method,
      path: url.pathname,
    }),
  );
  const errorResponse = await validateCfAccessJwt(context.request, env);
  return errorResponse ?? next();
});
