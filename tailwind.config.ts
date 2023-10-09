import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}'
  ],
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
        //Tremor colors
        tremor: {
          brand: {
            faint: "#eff6ff", // blue-50
            muted: "#bfdbfe", // blue-200
            subtle: "#60a5fa", // blue-400
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#1d4ed8", // blue-700
            inverted: "#ffffff", // white
          },
          background: {
            muted: "#f9fafb", // gray-50
            subtle: "#f3f4f6", // gray-100
            DEFAULT: "#ffffff", // white
            emphasis: "#374151", // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          ring: {
            DEFAULT: "#e5e7eb", // gray-200
          },
          content: {
            subtle: "#9ca3af", // gray-400
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#374151", // gray-700
            strong: "#111827", // gray-900
            inverted: "#ffffff", // white
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#172554", // blue-950
            subtle: "#1e40af", // blue-800
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#60a5fa", // blue-400
            inverted: "#030712", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1f2937", // gray-800
            DEFAULT: "#111827", // gray-900
            emphasis: "#d1d5db", // gray-300
          },
          border: {
            DEFAULT: "#1f2937", // gray-800
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
          content: {
            subtle: "#4b5563", // gray-600
            DEFAULT: "#6b7280", // gray-500
            emphasis: "#e5e7eb", // gray-200
            strong: "#f9fafb", // gray-50
            inverted: "#000000", // black
          },
        },
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1.25rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
    safelist: [
      {
        pattern:
          /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        variants: ["hover", "ui-selected"],
      },
      {
        pattern:
          /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        variants: ["hover", "ui-selected"],
      },
      {
        pattern:
          /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        variants: ["hover", "ui-selected"],
      },
      {
        pattern:
          /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      },
      {
        pattern:
          /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      },
      {
        pattern:
          /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      },
    ],
    plugins: [require("@headlessui/tailwindcss")],
  }
}
export default config
