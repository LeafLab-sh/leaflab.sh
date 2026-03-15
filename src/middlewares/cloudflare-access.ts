import { createRemoteJWKSet, jwtVerify } from "jose";

export async function validateCfAccessJwt(
  request: Request,
  env: { CLOUDFLARE_ACCESS_DOMAIN?: string; CLOUDFLARE_ACCESS_AUD?: string },
): Promise<Response | null> {
  const url = new URL(request.url);

  const { CLOUDFLARE_ACCESS_DOMAIN, CLOUDFLARE_ACCESS_AUD } = env;

  if (!CLOUDFLARE_ACCESS_DOMAIN || !CLOUDFLARE_ACCESS_AUD) {
    console.info(
      JSON.stringify({
        event: "cf_access_not_configured",
        error: "Cloudflare Access validation is not configured.",
        path: url.pathname,
      }),
    );
    return null; // not configured, skip
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
    console.error(
      JSON.stringify({
        event: "cf_access_jwt_not_provided",
        error:
          "Cloudflare Access validation is configured, but no token was " +
          "specified with this request.",
        path: url.pathname,
      }),
    );
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${CLOUDFLARE_ACCESS_DOMAIN}/cdn-cgi/access/certs`),
    );
    await jwtVerify(token, JWKS, {
      issuer: CLOUDFLARE_ACCESS_DOMAIN,
      audience: CLOUDFLARE_ACCESS_AUD,
    });

    console.info(
      JSON.stringify({
        event: "cf_access_validation_success",
        error: "Cloudflare Access validation succeeded.",
        path: url.pathname,
      }),
    );
    return null; // valid, proceed
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "cf_access_jwt_invalid",
        error: err instanceof Error ? err.message : String(err),
        path: url.pathname,
      }),
    );
    return new Response("Unauthorized", { status: 403 });
  }
}
