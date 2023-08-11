// import { session } from '@/stores/session';
import type { dtStyle } from '@/stores/session';
import { useSessionStore } from '@/stores';


export function toHumanDate (dt: Date) {
  const sessionStore = useSessionStore();
    const { timeZone, language, dateStyle, timeStyle } = sessionStore.locale;
    return new Intl.DateTimeFormat(language, { 
      dateStyle: dateStyle as dtStyle, 
      timeStyle: timeStyle as dtStyle, 
      timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(dt);
}

export function formatNumber (number: number) {
  const sessionStore = useSessionStore();
  const { language } = sessionStore.locale;
  return new Intl.NumberFormat(language).format(number)
}

export function formatCurrency (number: number) {
  const sessionStore = useSessionStore();
  const { language } = sessionStore.locale;
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(number)
}