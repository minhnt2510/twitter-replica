import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../components/ui/Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl']
    }
  }
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    name: 'Sarah Connor',
    size: 'lg'
  }
}

export const FallbackInitial: Story = {
  args: {
    name: 'Nguyen Tan Minh',
    size: 'lg'
  }
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Small" size="sm" />
      <Avatar name="Medium" size="md" />
      <Avatar name="Large" size="lg" />
      <Avatar name="Extra Large" size="xl" />
    </div>
  )
}
