import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { getCredentials, type UserType } from '../../helpers/credentials';
import { getBaseUrl } from '../../config/environments';
import { ROUTES } from '../../constants/routes.constants';

export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get campoUsuario() {
    return this.page.locator('[data-test="username"]');
  }

  get campoSenha() {
    return this.page.locator('[data-test="password"]');
  }

  get botaoLogin() {
    return this.page.locator('[data-test="login-button"]');
  }

  get mensagemErro() {
    return this.page.locator('[data-test="error"]');
  }

  async abrir(): Promise<void> {
    await this.page.goto(getBaseUrl() + ROUTES.LOGIN);
  }

  async logarComo(userType: UserType): Promise<void> {
    const { username, password } = getCredentials(userType);
    await this.preencherCredenciais(username, password);
  }

  async preencherCredenciais(username: string, password: string): Promise<void> {
    await this.campoUsuario.fill(username);
    await this.campoSenha.fill(password);
    await this.botaoLogin.click();
  }

  async verificarLoginSucesso(): Promise<void> {
    await this.page.waitForURL(new RegExp(ROUTES.INVENTORY));
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }

  async verificarMensagemErro(textoEsperado: string): Promise<void> {
    await expect(this.mensagemErro).toBeVisible();
    await expect(this.mensagemErro).toContainText(textoEsperado);
  }
}
