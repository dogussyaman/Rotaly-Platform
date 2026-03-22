import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useIsMobile } from '@/hooks/use-mobile'

type MediaListener = (event: MediaQueryListEvent) => void

const listeners = new Set<MediaListener>()

function emitResize(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  })

  const event = {
    matches: width < 768,
    media: '(max-width: 767px)',
  } as MediaQueryListEvent

  listeners.forEach((listener) => listener(event))
}

describe('useIsMobile', () => {
  beforeEach(() => {
    listeners.clear()
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addEventListener: (_event: string, listener: MediaListener) => {
          listeners.add(listener)
        },
        removeEventListener: (_event: string, listener: MediaListener) => {
          listeners.delete(listener)
        },
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      })),
    )
  })

  it('returns true below the mobile breakpoint', () => {
    emitResize(640)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('updates when the viewport crosses the breakpoint', () => {
    emitResize(1024)

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    act(() => {
      emitResize(720)
    })

    expect(result.current).toBe(true)
  })
})