import { createRemoteJWKSet, jwtVerify } from "jose";

export async function validateCfAccessJwt(
  request: Request,
  env: { CLOUDFLARE_ACCESS_DOMAIN?: string; CLOUDFLARE_ACCESS_AUD?: string },
): Promise<Response | null> {
  const { CLOUDFLARE_ACCESS_DOMAIN, CLOUDFLARE_ACCESS_AUD } = env;

  if (!CLOUDFLARE_ACCESS_DOMAIN || !CLOUDFLARE_ACCESS_AUD) {
    return null; // not configured, skip
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) {
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
    return null; // valid, proceed
  } catch {
    return new Response("Unauthorized", { status: 403 });
  }
}
