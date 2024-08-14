import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'pnpm build && pnpm preview',
    port: 4173,
  },
  use: {
    baseURL: `http://127.0.0.1:4173/vcv-sci/mycelium/`,
  },
  testDir: 'tests/ui',
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
};

export default config;
