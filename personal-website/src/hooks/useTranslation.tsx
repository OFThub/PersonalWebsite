'use client';

import { usePathname } from 'next/navigation';
import trDict from '@/dictionaries/tr.json';
import enDict from '@/dictionaries/en.json';

export type Locale = 'tr' | 'en';

const dictionaries = {
  tr: trDict,
  en: enDict,
};

export function useTranslation() {
  const pathname = usePathname();
  
  // Pathname'den locale'i belirle
  const locale: Locale = pathname.startsWith('/en') ? 'en' : 'tr';
  const dict = dictionaries[locale];

  return { t: dict, locale };
}