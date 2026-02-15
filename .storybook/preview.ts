import type { Preview } from '@storybook/react'
import { withThemeByClassName } from '@storybook/addon-themes'
import '../src/themes/variables.css'
import '../src/themes/light.css'
import '../src/themes/dark.css'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        Light: 'light',
        Dark: 'dark',
      },
      defaultTheme: 'Light',
    }),
  ],
}

export default preview
