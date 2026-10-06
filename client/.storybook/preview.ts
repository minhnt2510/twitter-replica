import type { Preview } from '@storybook/react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'twitter-dark',
      values: [
        { name: 'twitter-dark', value: '#000000' },
        { name: 'twitter-dim', value: '#15202b' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  }
}

export default preview
