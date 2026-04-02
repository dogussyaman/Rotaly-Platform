'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      offset={16}
      mobileOffset={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      gap={12}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            '!rounded-2xl !border-border/80 !p-4 !shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] !backdrop-blur-md',
          title: '!text-sm !font-semibold !leading-snug',
          description: '!text-xs !text-muted-foreground !mt-0.5',
          closeButton:
            '!left-auto !right-2 !top-2 !border-0 !bg-muted/70 !text-foreground hover:!bg-muted',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
