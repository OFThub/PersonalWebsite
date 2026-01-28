export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'tr';

export const dictionaries = {
  tr: () => import('@/dictionaries/tr.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}