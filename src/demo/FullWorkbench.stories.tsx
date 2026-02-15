import type { Meta, StoryObj } from '@storybook/react'
import { FullWorkbench } from './FullWorkbench'

const meta: Meta<typeof FullWorkbench> = {
  title: 'Demo/Full Workbench',
  component: FullWorkbench,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof FullWorkbench>

export const Default: Story = {}
