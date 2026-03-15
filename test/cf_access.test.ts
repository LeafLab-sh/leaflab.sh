import { describe, expect, test, vi } from "vitest";

vi.mock("astro:env/server", () => ({ LOG_LEVEL: "DEBUG" }));

import { validateCfAccessJwt } from "../src/utils/cf-access";
import type { Logger } from "../src/utils/logger";

vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => "mock-jwks"),
  jwtVerify: vi.fn(),
}));

const makeRequest = (token?: string) =>
  new Request("https://example.com", {
    headers: token ? { "Cf-Access-Jwt-Assertion": token } : {},
  });

const env = {
  CLOUDFLARE_ACCESS_DOMAIN: "https://myteam.cloudflareaccess.com",
  CLOUDFLARE_ACCESS_AUD: "abc123",
};

const logger = {
  info: vi.fn(),
  error: vi.fn(),
} as unknown as Logger;

describe("validateCfAccessJwt", () => {
  test("returns null when vars are not configured", async () => {
    const result = await validateCfAccessJwt(makeRequest(), {}, logger);
    expect(result).toBeNull();
  });

  test("returns 403 when token header is missing", async () => {
    const result = await validateCfAccessJwt(makeRequest(), env, logger);
    expect(result?.status).toBe(403);
  });

  test("returns 403 when jwtVerify throws", async () => {
    const { jwtVerify } = await import("jose");
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error("invalid token"));
    const result = await validateCfAccessJwt(
      makeRequest("bad.token.here"),
      env,
      logger,
    );
    expect(result?.status).toBe(403);
  });

  test("returns null when token is valid", async () => {
    const { jwtVerify } = await import("jose");
    vi.mocked(jwtVerify).mockResolvedValueOnce({
      payload: {},
      protectedHeader: {},
    } as any);
    const result = await validateCfAccessJwt(
      makeRequest("valid.token.here"),
      env,
      logger,
    );
    expect(result).toBeNull();
  });
});
