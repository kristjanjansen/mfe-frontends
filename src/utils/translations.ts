import i18n from "i18next";
import type { KeyPrefix } from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next, useTranslation } from "react-i18next";

const baseUrl = (import.meta.env.MFE_TRANSLATIONS_URL || "").replace(
  /\/$/,
  ""
);

const ns = ["billing", "dashboard", "cookiebot"] as const;

type TranslationsNS = (typeof ns)[number];
const defaultNS: TranslationsNS = "billing";

const loadPath = `${baseUrl}/{{lng}}/{{ns}}.json`;

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    supportedLngs: ["en", "et"],

    ns,
    defaultNS,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath,
    },

    react: {
      useSuspense: false,
    },
  });

export function useTranslationWithScope<NS extends TranslationsNS>(
  ns: NS,
  keyPrefix?: KeyPrefix<NS>
) {
  const { t, ...rest } = useTranslation(ns, {
    keyPrefix,
  });

  return {
    ...rest,
    ts: t,
  };
}
