export function formatDate(s: string) {
  return new Date(s).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(s: string | null) {
  if (!s) return '—';
  return new Date(`2000-01-01T${s}`).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(n: number) {
  return `₺${n.toLocaleString('tr-TR')}`;
}
