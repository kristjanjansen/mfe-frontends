import { describe, it, expect, vi } from "vitest";

describe("MFE window events", () => {
  it("mfe:navigate dispatches path to window", () => {
    const handler = vi.fn();
    window.addEventListener("mfe:navigate", handler);

    window.dispatchEvent(
      new CustomEvent("mfe:navigate", { detail: { path: "/billing" } })
    );

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.path).toBe("/billing");

    window.removeEventListener("mfe:navigate", handler);
  });

  it("mfe:route-changed dispatches path to window", () => {
    const handler = vi.fn();
    window.addEventListener("mfe:route-changed", handler);

    window.dispatchEvent(
      new CustomEvent("mfe:route-changed", { detail: { path: "/dashboard" } })
    );

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.path).toBe("/dashboard");

    window.removeEventListener("mfe:route-changed", handler);
  });

  it("multiple listeners receive the same event", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    window.addEventListener("mfe:route-changed", handler1);
    window.addEventListener("mfe:route-changed", handler2);

    window.dispatchEvent(
      new CustomEvent("mfe:route-changed", { detail: { path: "/orders" } })
    );

    expect(handler1).toHaveBeenCalledOnce();
    expect(handler2).toHaveBeenCalledOnce();

    window.removeEventListener("mfe:route-changed", handler1);
    window.removeEventListener("mfe:route-changed", handler2);
  });
});
