import { defineConfig, devices } from '@playwright/test';
import { getBaseUrl } from './tests/support/config/environments';

const baseURL = getBaseUrl();
const AUTH_FILE = 'playwright/.auth/user.json';

// ---------------------------------------------------------------------------
// Tags de dispositivo (use nos specs com { tag: '...' })
//
//   @desktop-only  → roda apenas no projeto "desktop"
//   @compact-only  → roda apenas nos projetos "mobile" e "tablet"
//   (sem tag)      → roda em todos os dispositivos
//
// Semântica de projetos:
//   e2e-setup → executa auth.setup.ts e gera playwright/.auth/user.json
//   desktop   → 1920×1080 Chrome; exclui @compact-only; depende de e2e-setup
//   mobile    → Chrome Mobile; exclui @desktop-only; depende de e2e-setup
//   tablet    → Chrome Tablet; exclui @desktop-only; depende de e2e-setup
//   Os testes de Login usam storageState vazio (deslogado) via test.use(),
//   então funcionam em qualquer projeto sem exigir o setup de auth.
// ---------------------------------------------------------------------------

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    // ── Setup de autenticação ──────────────────────────────────────────────
    {
      name: 'e2e-setup',
      testMatch: /auth\.setup\.ts/,
      use: { baseURL },
    },

    // ── Desktop 1920×1080 (Chrome) ─────────────────────────────────────────
    {
      name: 'desktop',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@compact-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        storageState: AUTH_FILE,
      },
    },

    // ── Mobile 390×844 (Chrome Mobile) ──────────────────────────────────────
    {
      name: 'mobile',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@desktop-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Pixel 5'],
        storageState: AUTH_FILE,
      },
    },

    // ── Tablet 834×1194 (Chrome Tablet) ─────────────────────────────────────
    {
      name: 'tablet',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@desktop-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 834, height: 1194 },
        storageState: AUTH_FILE,
      },
    },
  ],
});
