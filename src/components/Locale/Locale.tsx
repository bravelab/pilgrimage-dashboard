import React from "react";
import { IntlProvider } from "react-intl";

import locale_PL from "@locale/pl.json";

import useLocalStorage from "@saleor/hooks/useLocalStorage";

export enum Locale {
  AR = "ar",
  AZ = "az",
  BG = "bg",
  BN = "bn",
  CA = "ca",
  CS = "cs",
  DA = "da",
  DE = "de",
  EL = "el",
  EN = "en",
  ES = "es",
  ES_CO = "es-co",
  ET = "et",
  FA = "fa",
  FR = "fr",
  HI = "hi",
  HU = "hu",
  HY = "hy",
  ID = "id",
  IS = "is",
  IT = "it",
  JA = "ja",
  KO = "ko",
  MN = "mn",
  NB = "nb",
  NL = "nl",
  PL = "pl",
  PT = "pt",
  PT_BR = "pt-br",
  RO = "ro",
  RU = "ru",
  SK = "sk",
  SL = "sl",
  SQ = "sq",
  SR = "sr",
  SV = "sv",
  TH = "th",
  TR = "tr",
  UK = "uk",
  VI = "vi",
  ZH_HANS = "zh-hans",
  ZH_HANT = "zh-hant"
}

interface StructuredMessage {
  context?: string;
  string: string;
}
type LocaleMessages = Record<string, StructuredMessage>;
const localeData: Record<Locale, LocaleMessages> = {
  [Locale.AR]: undefined,
  [Locale.AZ]: undefined,
  [Locale.BG]: undefined,
  [Locale.BN]: undefined,
  [Locale.CA]: undefined,
  [Locale.CS]: undefined,
  [Locale.DA]: undefined,
  [Locale.DE]: undefined,
  [Locale.EL]: undefined,
  // Default language
  [Locale.EN]: undefined,
  [Locale.ES]: undefined,
  [Locale.ES_CO]: undefined,
  [Locale.ET]: undefined,
  [Locale.FA]: undefined,
  [Locale.FR]: undefined,
  [Locale.HI]: undefined,
  [Locale.HU]: undefined,
  [Locale.HY]: undefined,
  [Locale.ID]: undefined,
  [Locale.IS]: undefined,
  [Locale.IT]: undefined,
  [Locale.JA]: undefined,
  [Locale.KO]: undefined,
  [Locale.MN]: undefined,
  [Locale.NB]: undefined,
  [Locale.NL]: undefined,
  [Locale.PL]: locale_PL,
  [Locale.PT]: undefined,
  [Locale.PT_BR]: undefined,
  [Locale.RO]: undefined,
  [Locale.RU]: undefined,
  [Locale.SK]: undefined,
  [Locale.SL]: undefined,
  [Locale.SQ]: undefined,
  [Locale.SR]: undefined,
  [Locale.SV]: undefined,
  [Locale.TH]: undefined,
  [Locale.TR]: undefined,
  [Locale.UK]: undefined,
  [Locale.VI]: undefined,
  [Locale.ZH_HANS]: undefined,
  [Locale.ZH_HANT]: undefined
};

export const localeNames: Record<Locale, string> = {
  [Locale.AR]: "العربيّة",
  [Locale.AZ]: "Azərbaycanca",
  [Locale.BG]: "български",
  [Locale.BN]: "বাংলা",
  [Locale.CA]: "català",
  [Locale.CS]: "česky",
  [Locale.DA]: "dansk",
  [Locale.DE]: "Deutsch",
  [Locale.EL]: "Ελληνικά",
  [Locale.EN]: "English",
  [Locale.ES]: "español",
  [Locale.ES_CO]: "español de Colombia",
  [Locale.ET]: "eesti",
  [Locale.FA]: "فارسی",
  [Locale.FR]: "français",
  [Locale.HI]: "Hindi",
  [Locale.HU]: "Magyar",
  [Locale.HY]: "հայերեն",
  [Locale.ID]: "Bahasa Indonesia",
  [Locale.IS]: "Íslenska",
  [Locale.IT]: "italiano",
  [Locale.JA]: "日本語",
  [Locale.KO]: "한국어",
  [Locale.MN]: "Mongolian",
  [Locale.NB]: "norsk (bokmål)",
  [Locale.NL]: "Nederlands",
  [Locale.PL]: "polski",
  [Locale.PT]: "Português",
  [Locale.PT_BR]: "Português Brasileiro",
  [Locale.RO]: "Română",
  [Locale.RU]: "Русский",
  [Locale.SK]: "Slovensky",
  [Locale.SL]: "Slovenščina",
  [Locale.SQ]: "shqip",
  [Locale.SR]: "српски",
  [Locale.SV]: "svenska",
  [Locale.TH]: "ภาษาไทย",
  [Locale.TR]: "Türkçe",
  [Locale.UK]: "Українська",
  [Locale.VI]: "Tiếng Việt",
  [Locale.ZH_HANS]: "简体中文",
  [Locale.ZH_HANT]: "繁體中文"
};

const dotSeparator = "_dot_";
const sepRegExp = new RegExp(dotSeparator, "g");

function getKeyValueJson(messages: LocaleMessages): Record<string, string> {
  if (messages) {
    const keyValueMessages: Record<string, string> = {};
    return Object.entries(messages).reduce((acc, [id, msg]) => {
      acc[id.replace(sepRegExp, ".")] = msg.string;
      return acc;
    }, keyValueMessages);
  }
}

export function getMatchingLocale(languages: readonly string[]): Locale {
  const localeEntries = Object.entries(Locale);

  for (const preferredLocale of languages) {
    for (const localeEntry of localeEntries) {
      if (localeEntry[1].toLowerCase() === preferredLocale.toLowerCase()) {
        return Locale[localeEntry[0]];
      }
    }
  }

  return undefined;
}

const defaultLocale = Locale.EN;

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
export const LocaleContext = React.createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => undefined
});

const { Consumer: LocaleConsumer, Provider: RawLocaleProvider } = LocaleContext;

const LocaleProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useLocalStorage(
    "locale",
    getMatchingLocale(navigator.languages) || defaultLocale
  );

  return (
    <IntlProvider
      defaultLocale={defaultLocale}
      locale={locale}
      messages={getKeyValueJson(localeData[locale])}
      onError={err => {
        if (!err.includes("[React Intl] Missing message: ")) {
          console.error(err);
        }
      }}
      key={locale}
    >
      <RawLocaleProvider
        value={{
          locale,
          setLocale
        }}
      >
        {children}
      </RawLocaleProvider>
    </IntlProvider>
  );
};

export { LocaleConsumer, LocaleProvider, RawLocaleProvider };
