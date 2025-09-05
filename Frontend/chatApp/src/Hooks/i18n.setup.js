import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "welcome": "Welcome to my app" } },
    hi: { translation: { "welcome": "मेरे ऐप में आपका स्वागत है" } },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
