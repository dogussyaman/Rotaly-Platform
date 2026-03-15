export function formatCurrency(value: number): string {
  return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const EXTRAS_OPTION_LABELS: Record<string, string> = {
  parking: 'Otopark',
  babyBed: 'Bebek karyolası',
  extraCleaning: 'Ekstra temizlik',
  withPet: 'Evcil hayvan',
};

/** Rezervasyon ekstralarını okunabilir metne çevirir (note + options objesi). */
export function formatExtras(extras: Record<string, unknown> | null): { label: string; value: string }[] {
  if (!extras || typeof extras !== 'object') return [];
  const out: { label: string; value: string }[] = [];

  if (extras.note !== undefined && extras.note !== null && extras.note !== '') {
    out.push({ label: 'Not', value: String(extras.note) });
  }

  const options = extras.options;
  if (options !== undefined && options !== null && typeof options === 'object') {
    const opt = options as Record<string, unknown>;
    for (const [key, val] of Object.entries(opt)) {
      if (val === true || val === 'true') {
        out.push({ label: EXTRAS_OPTION_LABELS[key] ?? key, value: 'Evet' });
      }
    }
  }

  return out;
}
