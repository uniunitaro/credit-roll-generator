import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import neutral from '@park-ui/panda-preset/colors/neutral'

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({ accentColor: neutral, grayColor: neutral, radius: 'xl' }),
  ],
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',
  theme: {
    extend: {},
  },
  globalCss: {
    extend: {
      html: {
        '--global-font-body': 'sans-serif',
      },
      '@media(hover: hover) and (pointer: fine)': {
        '::-webkit-scrollbar': {
          width: '16px',
          height: '16px',
        },
        '::-webkit-scrollbar-thumb': {
          bg: 'gray.8',
          borderRadius: '8px',
          border: '4px solid transparent',
          backgroundClip: 'content-box',
          '&:hover': {
            bg: 'gray.10',
            borderRadius: '8px',
            border: '4px solid transparent',
            backgroundClip: 'content-box',
          },
        },
      },
      '@supports not selector(::-webkit-scrollbar)': {
        '*': {
          scrollbarWidth: 'thin',
        },
      },
    },
  },
  outdir: 'styled-system',
})
