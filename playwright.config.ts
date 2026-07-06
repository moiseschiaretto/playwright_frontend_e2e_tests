import { defineConfig, devices } from '@playwright/test';
import { getBaseUrl } from './tests/support/config/environments';

const baseURL = getBaseUrl();
const AUTH_FILE = 'playwright/.auth/user.json';

// ---------------------------------------------------------------------------
// Tags de dispositivo (use nos specs com { tag: '...' })
//
//   @desktop-only  → roda apenas no projeto "desktop"
//   @compact-only  → roda apenas nos projetos "mobile", "tablet" e "iphone17"
//   (sem tag)      → roda em todos os dispositivos
//
// Dispositivos e resoluções (Nome — Resolução):
//   Desktop     (1920x1080)
//   Tablet      (768x1024)
//   Smartphone  (360x800)
//   iPhone 17   (402x874)
//
// Semântica de projetos:
//   e2e-setup → executa auth.setup.ts e gera playwright/.auth/user.json
//   desktop   → Desktop (1920x1080); exclui @compact-only; depende de e2e-setup
//   mobile    → Smartphone (360x800); exclui @desktop-only; depende de e2e-setup
//   tablet    → Tablet (768x1024); exclui @desktop-only; depende de e2e-setup
//   iphone17  → iPhone 17 (402x874); exclui @desktop-only; depende de e2e-setup
//   Os testes de Login usam storageState vazio (deslogado) via test.use(),
//   então funcionam em qualquer projeto sem exigir o setup de auth.
// ---------------------------------------------------------------------------

// Dispositivo customizado — não existe preset oficial do Playwright para o
// iPhone 17 ainda, então montamos manualmente as características de um
// smartphone Apple recente (touch, mobile, deviceScaleFactor 3x), mantendo
// o motor Chromium para ficar consistente com o restante do projeto
// (não precisa instalar o WebKit à parte).
const IPHONE_17 = {
  viewport: { width: 402, height: 874 }, // iPhone 17 (402x874)
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['./tests/support/reporters/grouped-console-reporter.ts'],
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

    // ── Desktop (1920x1080) — Chrome ────────────────────────────────────────
    {
      name: 'desktop',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@compact-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, // Desktop (1920x1080)
        storageState: AUTH_FILE,
      },
    },

    // ── Smartphone (360x800) — Chrome Mobile ────────────────────────────────
    {
      name: 'mobile',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@desktop-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 360, height: 800 }, // Smartphone (360x800)
        storageState: AUTH_FILE,
      },
    },

    // ── Tablet (768x1024) — Chrome Tablet ────────────────────────────────────
    {
      name: 'tablet',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@desktop-only/,
      dependencies: ['e2e-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 }, // Tablet (768x1024)
        storageState: AUTH_FILE,
      },
    },

    // ── iPhone 17 (402x874) — Chromium com emulação mobile Apple ────────────
    {
      name: 'iphone17',
      testMatch: /\/e2e\/.*\.spec\.ts$/,
      grepInvert: /@desktop-only/,
      dependencies: ['e2e-setup'],
      use: {
        browserName: 'chromium',
        ...IPHONE_17, // iPhone 17 (402x874)
        storageState: AUTH_FILE,
      },
    },
  ],
});
