import { describe, expect, it } from 'vitest'

import { reducer } from '@/hooks/use-toast'

describe('toast reducer', () => {
  it('keeps only the latest toast because of the toast limit', () => {
    const firstState = reducer(
      { toasts: [] },
      { type: 'ADD_TOAST', toast: { id: '1', open: true } },
    )
    const secondState = reducer(firstState, {
      type: 'ADD_TOAST',
      toast: { id: '2', open: true },
    })

    expect(secondState.toasts).toHaveLength(1)
    expect(secondState.toasts[0]?.id).toBe('2')
  })

  it('marks a toast as closed when dismissed', () => {
    const nextState = reducer(
      { toasts: [{ id: '1', open: true }] },
      { type: 'DISMISS_TOAST', toastId: '1' },
    )

    expect(nextState.toasts[0]?.open).toBe(false)
  })

  it('removes all toasts when requested', () => {
    const nextState = reducer(
      { toasts: [{ id: '1', open: false }, { id: '2', open: false }] },
      { type: 'REMOVE_TOAST' },
    )

    expect(nextState.toasts).toEqual([])
  })
})