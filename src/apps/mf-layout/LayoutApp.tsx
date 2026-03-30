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

function getAuth() {
  return (window as any).__MFE_AUTH__ as {
    user: { name: string };
    mandates: { id: string; label: string }[];
    activeMandate: string;
  } | undefined;
}

function switchMandate(mandateId: string) {
  const auth = (window as any).__MFE_AUTH__;
  if (auth) auth.activeMandate = mandateId;
  window.dispatchEvent(
    new CustomEvent("mfe:mandate-changed", { detail: { mandateId } })
  );
}

export default function LayoutApp() {
  const [currentPath, setCurrentPath] = useState("/");
  const [activeMandate, setActiveMandate] = useState(
    () => getAuth()?.activeMandate ?? ""
  );
  const auth = getAuth();

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

  function handleMandateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const mandateId = e.target.value;
    setActiveMandate(mandateId);
    switchMandate(mandateId);
  }

  return (
    <main className="h-screen flex">
      <nav
        className="p-4 flex-none w-[240px] flex flex-col gap-4"
        style={{
          background: "color-mix(in srgb, var(--fg) 10%, var(--bg))",
        }}
      >
        {auth && (
          <div className="text-sm">
            <div className="font-bold">{auth.user.name}</div>
            <select
              value={activeMandate}
              onChange={handleMandateChange}
              className="mt-1 w-full p-1 rounded text-sm"
              style={{
                background: "var(--bg)",
                color: "var(--fg)",
              }}
            >
              {auth.mandates.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex-1">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={
                "block p-2 cursor-pointer " +
                (link.path === currentPath ? "underline" : "")
              }
            >
              {link.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 cursor-pointer text-sm opacity-50"
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
