import { describe, expect, test, vi } from "vitest";
import { validateCfAccessJwt } from "../src/middlewares/cloudflare-access";

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

describe("validateCfAccessJwt", () => {
  test("returns null when vars are not configured", async () => {
    const result = await validateCfAccessJwt(makeRequest(), {});
    expect(result).toBeNull();
  });

  test("returns 403 when token header is missing", async () => {
    const result = await validateCfAccessJwt(makeRequest(), env);
    expect(result?.status).toBe(403);
  });

  test("returns 403 when jwtVerify throws", async () => {
    const { jwtVerify } = await import("jose");
    vi.mocked(jwtVerify).mockRejectedValueOnce(new Error("invalid token"));
    const result = await validateCfAccessJwt(
      makeRequest("bad.token.here"),
      env,
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
    );
    expect(result).toBeNull();
  });
});
