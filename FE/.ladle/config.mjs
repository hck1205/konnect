/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'src/**/*.stories.{ts,tsx}',
  // next/link 를 스텁으로 바꾼다 — 스토리에는 Next 런타임이 없다
  viteConfig: './.ladle/vite.config.ts',
  defaultStory: 'primitives-button--variants',
  addons: {
    a11y: { enabled: true },
    theme: { enabled: true, defaultState: 'light' },
    width: {
      enabled: true,
      options: { mobile: 375, tablet: 768, desktop: 1280 },
      defaultState: 0,
    },
    rtl: { enabled: false },
    ladle: { enabled: false },
  },
};
