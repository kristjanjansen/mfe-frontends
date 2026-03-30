import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LayoutApp from "./LayoutApp";

beforeEach(() => {
  (window as any).__MFE_AUTH__ = {
    user: { name: "Test User" },
    mandates: [
      { id: "m-1", label: "Home" },
      { id: "m-2", label: "Company OÜ" },
    ],
    activeMandate: "m-1",
  };
});

afterEach(() => {
  delete (window as any).__MFE_AUTH__;
});

describe("LayoutApp", () => {
  it("renders navigation links", () => {
    render(<LayoutApp />);
    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Billing")).toBeDefined();
  });

  it("renders user name from auth", () => {
    render(<LayoutApp />);
    expect(screen.getByText("Test User")).toBeDefined();
  });

  it("renders mandate selector with options", () => {
    render(<LayoutApp />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDefined();
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Company OÜ")).toBeDefined();
  });

  it("dispatches mfe:navigate on nav click", () => {
    const handler = vi.fn();
    window.addEventListener("mfe:navigate", handler);

    render(<LayoutApp />);
    fireEvent.click(screen.getByText("Billing"));

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.path).toBe("/billing");

    window.removeEventListener("mfe:navigate", handler);
  });

  it("dispatches mfe:mandate-changed on mandate switch", () => {
    const handler = vi.fn();
    window.addEventListener("mfe:mandate-changed", handler);

    render(<LayoutApp />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "m-2" },
    });

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.mandateId).toBe("m-2");

    window.removeEventListener("mfe:mandate-changed", handler);
  });

  it("updates active state on mfe:route-changed", () => {
    render(<LayoutApp />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent("mfe:route-changed", { detail: { path: "/billing" } })
      );
    });

    const billingBtn = screen.getByText("Billing");
    expect(billingBtn.className).toContain("underline");
  });

  it("renders toggle theme button", () => {
    render(<LayoutApp />);
    expect(screen.getByText("Toggle theme")).toBeDefined();
  });

  it("toggles data-theme on theme button click", () => {
    document.documentElement.setAttribute("data-theme", "light");
    const mockSetItem = vi.fn();
    vi.stubGlobal("localStorage", { ...localStorage, setItem: mockSetItem, getItem: vi.fn() });

    render(<LayoutApp />);
    fireEvent.click(screen.getByText("Toggle theme"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(mockSetItem).toHaveBeenCalledWith("theme", "dark");

    vi.unstubAllGlobals();
  });
});
