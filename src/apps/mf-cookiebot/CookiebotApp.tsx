import { useTranslationWithScope } from "../../utils/translations";

export default function CookiebotApp() {
  const { ts } = useTranslationWithScope("cookiebot");
  return (
    <div>
      <div className="p-4 flex flex-col gap-4 fixed right-8 bottom-8 w-1/4 border-2 rounded" style={{ background: "color-mix(in srgb, var(--fg) 5%, var(--bg))", borderColor: "color-mix(in srgb, var(--fg) 20%, var(--bg))" }}>
        <h1 className="text-2xl font-bold">{ts("common.title")}</h1>
        <p>{ts("common.body")}</p>
      </div>
    </div>
  );
}
