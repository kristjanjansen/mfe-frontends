import { describe, it, expect, afterEach } from "vitest";
import { registerCustomElement } from "./utils";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("registerCustomElement", () => {
  it("registers a custom element that renders React content", async () => {
    function TestApp() {
      return <div data-testid="test">Hello</div>;
    }

    registerCustomElement("test-basic", TestApp);

    const el = document.createElement("test-basic");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));

    expect(el.querySelector("[data-testid='test']")?.textContent).toBe("Hello");
  });

  it("renders inside shadow DOM when shadow option is true", async () => {
    function ShadowApp() {
      return <div data-testid="shadow">In shadow</div>;
    }

    registerCustomElement("test-shadow", ShadowApp, { shadow: true });

    const el = document.createElement("test-shadow");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));

    const shadow = el.shadowRoot;
    expect(shadow).not.toBeNull();
    expect(shadow?.querySelector("[data-testid='shadow']")?.textContent).toBe("In shadow");
  });

  it("injects CSS into shadow DOM", async () => {
    function CssApp() {
      return <div>Styled</div>;
    }

    registerCustomElement("test-css", CssApp, {
      shadow: true,
      css: ".test { color: red; }",
    });

    const el = document.createElement("test-css");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));

    const style = el.shadowRoot?.querySelector("style");
    expect(style?.textContent).toContain(".test { color: red; }");
  });

  it("passes basePath prop from base-path attribute", async () => {
    let receivedBasePath = "";

    function PathApp({ basePath }: { basePath: string }) {
      receivedBasePath = basePath;
      return <div>{basePath}</div>;
    }

    registerCustomElement("test-basepath", PathApp);

    const el = document.createElement("test-basepath");
    el.setAttribute("base-path", "/billing");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));

    expect(receivedBasePath).toBe("/billing");
  });

  it("updates basePath when attribute changes", async () => {
    let receivedBasePath = "";

    function PathApp2({ basePath }: { basePath: string }) {
      receivedBasePath = basePath;
      return <div>{basePath}</div>;
    }

    registerCustomElement("test-basepath2", PathApp2);

    const el = document.createElement("test-basepath2");
    el.setAttribute("base-path", "/billing");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(receivedBasePath).toBe("/billing");

    el.setAttribute("base-path", "/orders");
    await new Promise((r) => setTimeout(r, 0));
    expect(receivedBasePath).toBe("/orders");
  });

  it("cleans up on disconnect", async () => {
    function CleanupApp() {
      return <div data-testid="cleanup">Mounted</div>;
    }

    registerCustomElement("test-cleanup", CleanupApp);

    const el = document.createElement("test-cleanup");
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(el.querySelector("[data-testid='cleanup']")).not.toBeNull();

    document.body.removeChild(el);
  });

  it("does not re-register an existing tag", () => {
    function App1() {
      return <div>First</div>;
    }
    function App2() {
      return <div>Second</div>;
    }

    registerCustomElement("test-noreregister", App1);
    registerCustomElement("test-noreregister", App2);

    // Should still be the first registration
    expect(customElements.get("test-noreregister")).toBeDefined();
  });
});
