import { describe, expect, it } from 'vitest'

import { formatCurrency, formatDate, formatExtras } from '@/lib/format'

describe('format helpers', () => {
  it('formats currency in Turkish lira', () => {
    expect(formatCurrency(1250)).toContain('₺')
  })

  it('formats ISO-like dates for Turkish locale', () => {
    expect(formatDate('2026-03-22')).toMatch(/2026/)
  })

  it('formats extras note and enabled options', () => {
    expect(
      formatExtras({
        note: 'Late check-in',
        options: {
          parking: true,
          withPet: 'true',
          extraCleaning: false,
        },
      }),
    ).toEqual([
      { label: 'Not', value: 'Late check-in' },
      { label: 'Otopark', value: 'Evet' },
      { label: 'Evcil hayvan', value: 'Evet' },
    ])
  })

  it('returns an empty list for invalid extras payloads', () => {
    expect(formatExtras(null)).toEqual([])
    expect(formatExtras('invalid' as unknown as Record<string, unknown>)).toEqual([])
  })
})