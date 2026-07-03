import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { LoginPage } from './pages/Login/loginPage';

export const AUTH_FILE = path.resolve(process.cwd(), 'playwright/.auth/user.json');

/**
 * Setup de autenticação Playwright-nativo.
 * Loga uma única vez como standard_user e persiste o estado em
 * playwright/.auth/user.json. Os projetos desktop/mobile/tablet dependem
 * deste setup via `dependencies` (ver playwright.config.ts).
 */
setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);

  await login.abrir();
  await login.logarComo('standard');
  await login.verificarLoginSucesso();

  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
