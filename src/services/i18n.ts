/**
 * @fileoverview i18next configuration for internationalization
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

/**
 * Initialize i18next with HTTP backend and React integration
 */
export const initializeI18n = async (): Promise<void> => {
    await i18n
        .use(HttpApi)
        .use(initReactI18next)
        .init({
            lng: 'pl',
            fallbackLng: 'en',
            debug: import.meta.env.DEV,

            interpolation: {
                escapeValue: false,
            },

            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
            },

            ns: ['common'],
            defaultNS: 'common',

            react: {
                useSuspense: false,
            },
        });
};

export default i18n;
