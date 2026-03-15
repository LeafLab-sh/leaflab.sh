import { defineMiddleware } from "astro:middleware";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Logger } from "../utils/logger";
import {
  CLOUDFLARE_ACCESS_DOMAIN,
  CLOUDFLARE_ACCESS_AUD,
} from "astro:env/server";
import { LogEvent } from "../utils/log_events";

interface CfAccessEnv {
  CLOUDFLARE_ACCESS_DOMAIN?: string;
  CLOUDFLARE_ACCESS_AUD?: string;
}

export async function validateCfAccessJwt(
  request: Request,
  env: CfAccessEnv,
  logger: Logger,
): Promise<Response | null> {
  if (!env.CLOUDFLARE_ACCESS_DOMAIN || !env.CLOUDFLARE_ACCESS_AUD) {
    logger.info({
      event: LogEvent.CF_ACCESS_NOT_CONFIGURED,
      message: "Cloudflare Access validation is not configured.",
    });
    return null; // not configured, skip
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    logger.error({
      event: LogEvent.CF_ACCESS_JWT_NOT_PROVIDED,
      message:
        "Cloudflare Access validation is configured but no token was specified with this request.",
    });
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${env.CLOUDFLARE_ACCESS_DOMAIN}/cdn-cgi/access/certs`),
    );
    await jwtVerify(token, JWKS, {
      issuer: env.CLOUDFLARE_ACCESS_DOMAIN,
      audience: env.CLOUDFLARE_ACCESS_AUD,
    });

    logger.info({
      event: LogEvent.CF_ACCESS_VALIDATION_SUCCESS,
      message: "Cloudflare Access validation succeeded.",
    });
    return null; // valid, proceed
  } catch (err) {
    logger.error({
      event: LogEvent.CF_ACCESS_JWT_INVALID,
      message: "Cloudflare Access validation failed.",
      error: err instanceof Error ? err.message : String(err),
    });
    return new Response("Unauthorized", { status: 403 });
  }
}

export const cfAccessMiddleware = defineMiddleware(async (context, next) => {
  const errorResponse = await validateCfAccessJwt(
    context.request,
    { CLOUDFLARE_ACCESS_DOMAIN, CLOUDFLARE_ACCESS_AUD },
    context.locals.logger,
  );
  return errorResponse ?? next();
});
