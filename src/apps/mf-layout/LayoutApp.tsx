import { useEffect, useState } from "react";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/billing", label: "Billing" },
];

function toggleTheme() {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

export default function LayoutApp() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent<{ path: string }>).detail?.path;
      if (path) setCurrentPath(path);
    };
    window.addEventListener("mfe:route-changed", handler);
    return () => window.removeEventListener("mfe:route-changed", handler);
  }, []);

  function handleNavigate(path: string) {
    window.dispatchEvent(
      new CustomEvent("mfe:navigate", { detail: { path } })
    );
  }

  return (
    <main className="h-screen flex bg-surface text-on-surface">
      <nav className="p-4 bg-surface-secondary flex-none w-[240px] flex flex-col">
        <div className="flex-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={
                "block p-2 cursor-pointer text-on-surface " +
                (link.path === currentPath ? "underline" : "")
              }
            >
              {link.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 cursor-pointer text-on-surface-secondary text-sm"
        >
          Toggle theme
        </button>
      </nav>
      <div className="flex-1">
        <slot name="content"></slot>
      </div>
    </main>
  );
}
