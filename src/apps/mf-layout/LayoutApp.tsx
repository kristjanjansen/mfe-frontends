import { useEffect, useState } from "react";

const links = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/billing", label: "Billing" },
];

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
    <main className="h-screen flex">
      <nav className="p-4 bg-gray-100 flex-none w-[240px]">
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
      </nav>
      <div className="flex-1">
        <slot name="content"></slot>
      </div>
    </main>
  );
}
