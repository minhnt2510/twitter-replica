import type { Meta, StoryObj } from '@storybook/react'
import { BrandMark } from '../components/ui/BrandMark'

const meta: Meta<typeof BrandMark> = {
  title: 'UI/BrandMark',
  component: BrandMark,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof BrandMark>

export const Default: Story = {
  args: {}
}

export const Large: Story = {
  args: {
    className: 'scale-150 m-4'
  }
}
