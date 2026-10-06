import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../components/ui/Alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'error']
    }
  }
}

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: {
    type: 'info',
    children: 'Please check your inbox to verify your email address.'
  }
}

export const Success: Story = {
  args: {
    type: 'success',
    children: 'Profile updated successfully!'
  }
}

export const Error: Story = {
  args: {
    type: 'error',
    children: 'Invalid credentials. Please verify your email and password.'
  }
}
