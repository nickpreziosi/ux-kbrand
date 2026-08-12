export {
  APP_LANGUAGE_OPTIONS,
  getDirForAppLanguage,
  resolveAppLocaleFromCookieValue,
  getStoredAppLanguage,
  persistAppLanguage,
  type AppLanguageCode,
} from "@/lib/platform-preferences/language";
export {
  PLATFORM_LANGUAGE_COOKIE as APP_LANGUAGE_COOKIE,
  PLATFORM_LANGUAGE_STORAGE_KEY as APP_LANGUAGE_STORAGE_KEY,
} from "@/lib/platform-preferences/constants";
