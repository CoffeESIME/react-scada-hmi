import type { Config } from 'tailwindcss'
import {nextui} from "@nextui-org/react";
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {

        // Display Color Use
        'display-background': '#E0E0E0', // Display Background (no tabs)
        'tab-panel-background': '#E0E0E0', // Tab Panel Background
        'display-bg-tabs': '#C0C0C0', // Display Background behind tabs (with tabs)

        // Static Object Color Use
        'title-foreground': '#3F3F3F',
        'group-heading': '#3F3F3F',
        'column-heading': '#3F3F3F',
        'separator-line': '#D8D8D8',
        'process-connector': '#A0A0A4',
        'equipment-border': '#A0A0A4',
        'grouping-box': '#E8E8E8',

        // Notification Color Use
        'low-priority-alarm': '#916AAD',
        'low-priority-alarm-fg': '#FFFFFF',
        'medium-priority-alarm': '#F5E11B',
        'medium-priority-alarm-fg': '#3F3F3F',
        'high-priority-alarm': '#EC8629',
        'high-priority-alarm-fg': '#FFFFFF',
        'urgent-priority-alarm': '#E22028',
        'urgent-priority-alarm-fg': '#FFFFFF',
        'program-error': '#E22028',
        'program-error-fg': '#FFFFFF',
        'fault-condition-bg': '#000000',
        'fault-condition-fg': '#FFFFFF',
        'warning-condition-bg': '#3F3F3F',
        'warning-condition-fg': '#FFFFFF',
        'prompts-attention-bg': '#E0E0E0',
        'prompts-attention-fg': '#000000',
        'testing-simulation-bg': '#E0E0E0',
        'testing-simulation-fg': '#000000',
        'abnormal-state-bg': '#E0E0E0',
        'abnormal-state-fg': '#000000',

        // Element State Color
        'off-de-energized': '#F0F0F0',
        'on-energized': '#808080',
        'disabled': '#808080',
        'manual-operations': '#93C2E4',
        'transition': '#93C2E4',

        // Data Entry Color
        'label-fg': '#3F3F3F',
        'engineering-unit': '#919191',
        'input-field-allowed': '#3F3F3F',
        'checkbox-allowed': '#3F3F3F',
        'radio-button-allowed': '#3F3F3F',
        'input-field-prohibited': '#C0C0C0',
        'checkbox-prohibited': '#C0C0C0',
        'radio-button-prohibited': '#C0C0C0',
        'background-allowed': '#FFFFFF',
        'background-prohibited': '#E0E0E0',

        // Dynamic Data Display Color
        'data-label': '#3F3F3F',
        'data-engineering-unit': '#919191',
        'data-fg': '#475CA7',
        'data-border': '#C0C0C0',
        'primary-indicator-fg': '#475CA7',
        'primary-indicator-bg': '#D4D4D4',
        //Gradient widgets
        'low-priority': '#D4D4D4',
        'low-priority-fg': '#D4D4D4',
        'medium-priority': '#C0C0C0',
        'medium-priority-fg': '#C0C0C0',
        'high-priority': '#919191',
        'high-priority-fg': '#919191',
        'urgent-priority': '#3F3F3F',
        'urgent-priority-fg': '#3F3F3F',

        // Navigation Button
        'nav-button-fg': '#C6C6C6',
        'nav-button-border': '#AAAAAA',
        'nav-label': '#3F3F3F',
 
      },
      
    },
  },
  plugins: [nextui()]
}
export default config
