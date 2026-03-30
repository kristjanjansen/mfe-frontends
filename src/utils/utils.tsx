import React from "react";
import ReactDOM from "react-dom/client";

type RegisterOptions = {
  shadow?: boolean;
  css?: string;
};

export function registerCustomElement(
  tag: string,
  App: React.ComponentType<any>,
  options: RegisterOptions = {}
) {
  if (customElements.get(tag)) return;

  class MfElement extends HTMLElement {
    private root?: ReactDOM.Root;
    private shadow?: ShadowRoot;

    connectedCallback() {
      const { shadow, css } = options;

      let mountTarget: Element = this;

      if (shadow) {
        if (!this.shadow) {
          this.shadow = this.attachShadow({ mode: "open" });

          if (css) {
            const style = document.createElement("style");
            style.textContent = css;
            this.shadow.prepend(style);
          }
        }

        mountTarget = this.shadow as unknown as Element;
      }

      if (!this.root) {
        this.root = ReactDOM.createRoot(mountTarget);
      }

      this.root.render(<App />);
    }

    disconnectedCallback() {
      if (this.root) {
        this.root.unmount();
        this.root = undefined;
      }
    }
  }

  customElements.define(tag, MfElement);
}

