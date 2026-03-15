import { describe, expect, test, vi, beforeEach } from "vitest";

vi.mock("astro:env/server", () => ({ LOG_LEVEL: "DEBUG" }));

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
    expect(out.level).toBe("DEBUG");
    expect(out.message).toBe("test debug");
    expect(out.event).toBe(LogEvent.REQUEST);
    expect(typeof out.timestamp).toBe("string");
    expect(() => new Date(out.timestamp)).not.toThrow();
  });

  test("info calls console.log with correct JSON shape", () => {
    logger.info({ event: LogEvent.REQUEST, message: "test info" });
    const out = parseOutput(console.log);
    expect(out.level).toBe("INFO");
    expect(out.message).toBe("test info");
  });

  test("warn calls console.log with correct JSON shape", () => {
    logger.warn({ event: LogEvent.REQUEST, message: "test warn" });
    const out = parseOutput(console.log);
    expect(out.level).toBe("WARN");
  });

  test("error calls console.error instead of console.log", () => {
    logger.error({ event: LogEvent.REQUEST, message: "test error" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    const out = parseOutput(console.error);
    expect(out.level).toBe("ERROR");
    expect(out.message).toBe("test error");
  });

  test("fatal calls console.error instead of console.log", () => {
    logger.fatal({ event: LogEvent.REQUEST, message: "test fatal" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    const out = parseOutput(console.error);
    expect(out.level).toBe("FATAL");
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

describe("log level filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  const getLogger = async (level: string) => {
    vi.doMock("astro:env/server", () => ({ LOG_LEVEL: level }));
    const mod = await import("../src/utils/logger?level=" + level);
    return mod.logger;
  };

  test("LOG_LEVEL=INFO suppresses debug, passes info", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const filteredLogger = await getLogger("INFO");
    filteredLogger.debug({
      event: LogEvent.REQUEST,
      message: "should be suppressed",
    });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    filteredLogger.info({ event: LogEvent.REQUEST, message: "should pass" });
    expect(vi.mocked(console.log)).toHaveBeenCalledOnce();
  });

  test("LOG_LEVEL=ERROR suppresses warn, passes error", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const filteredLogger = await getLogger("ERROR");
    filteredLogger.warn({ event: LogEvent.REQUEST, message: "suppressed" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    filteredLogger.error({ event: LogEvent.REQUEST, message: "passes" });
    expect(vi.mocked(console.error)).toHaveBeenCalledOnce();
  });

  test("unknown LOG_LEVEL defaults to INFO behavior", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    const filteredLogger = await getLogger("INVALID");
    filteredLogger.debug({ event: LogEvent.REQUEST, message: "suppressed" });
    expect(vi.mocked(console.log)).not.toHaveBeenCalled();
    filteredLogger.info({ event: LogEvent.REQUEST, message: "passes" });
    expect(vi.mocked(console.log)).toHaveBeenCalledOnce();
  });
});
