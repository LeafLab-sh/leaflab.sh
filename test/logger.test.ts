import { describe, expect, test, vi, beforeEach } from "vitest";
import { logger, LogEvent } from "../src/utils/logger";

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  const parseOutput = (mock: ReturnType<typeof vi.spyOn>) => {
    const call = vi.mocked(mock).mock.calls[0]?.[0];
    return JSON.parse(call as string);
  };

  test("debug calls console.log with correct JSON shape", () => {
    logger.debug({ event: LogEvent.REQUEST, message: "test debug" });
    const out = parseOutput(console.log);
    expect(out.level).toBe("debug");
    expect(out.message).toBe("test debug");
    expect(out.event).toBe(LogEvent.REQUEST);
    expect(typeof out.timestamp).toBe("string");
    expect(() => new Date(out.timestamp)).not.toThrow();
  });

  test("info calls console.log with correct JSON shape", () => {
    logger.info({ event: LogEvent.REQUEST, message: "test info" });
    const out = parseOutput(console.log);
    expect(out.level).toBe("info");
    expect(out.message).toBe("test info");
  });

  test("warn calls console.log with correct JSON shape", () => {
    logger.warn({ event: LogEvent.REQUEST, message: "test warn" });
    const out = parseOutput(console.log);
    expect(out.level).toBe("warn");
  });

  test("error calls console.error instead of console.log", () => {
    logger.error({ event: LogEvent.REQUEST, message: "test error" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    const out = parseOutput(console.error);
    expect(out.level).toBe("error");
    expect(out.message).toBe("test error");
  });

  test("fatal calls console.error instead of console.log", () => {
    logger.fatal({ event: LogEvent.REQUEST, message: "test fatal" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    const out = parseOutput(console.error);
    expect(out.level).toBe("fatal");
  });

  test("output is valid JSON with ISO timestamp", () => {
    logger.info({ event: LogEvent.REQUEST, message: "timestamp test" });
    const out = parseOutput(console.log);
    expect(new Date(out.timestamp).toISOString()).toBe(out.timestamp);
  });

  test("extra metadata fields are spread into the output", () => {
    logger.info({
      event: LogEvent.REQUEST,
      message: "with metadata",
      userId: "u-123",
      path: "/home",
    });
    const out = parseOutput(console.log);
    expect(out.userId).toBe("u-123");
    expect(out.path).toBe("/home");
  });
});
