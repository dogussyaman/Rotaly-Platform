import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

function DemoForm() {
  const form = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)}>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe('Form primitives', () => {
  it('renders validation feedback and updates aria-invalid', async () => {
    const user = userEvent.setup()

    render(<DemoForm />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const input = screen.getByPlaceholderText('you@example.com')

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})