import { enUS, tr, de as deLocale, fr as frLocale } from 'date-fns/locale';
import type { Locale as AppLocale } from './translations';

export function intlLocaleTag(locale: AppLocale): string {
  if (locale === 'tr') return 'tr-TR';
  if (locale === 'de') return 'de-DE';
  if (locale === 'fr') return 'fr-FR';
  return 'en-US';
}

export function dateFnsLocale(locale: AppLocale) {
  if (locale === 'tr') return tr;
  if (locale === 'de') return deLocale;
  if (locale === 'fr') return frLocale;
  return enUS;
}

export function formatNumber(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(intlLocaleTag(locale)).format(value);
}

export function formatCurrencyTRY(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(intlLocaleTag(locale), {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

