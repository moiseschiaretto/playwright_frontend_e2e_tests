import { test } from '@playwright/test';
import { LoginPage } from '../../support/pages/Login/loginPage';
import { getCredentials } from '../../support/helpers/credentials';

test.describe('Login', () => {
  // Regra de convenção: suites deslogadas devem sobrescrever o storageState do projeto
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Deve fazer login com sucesso (standard_user)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.logarComo('standard');
    await login.verificarLoginSucesso();
  });

  test('Deve bloquear login de usuário bloqueado (locked_out_user)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.logarComo('lockedOut');
    await login.verificarMensagemErro('Sorry, this user has been locked out');
  });

  test('Deve exibir erro com senha inválida', async ({ page }) => {
    const login = new LoginPage(page);
    const { username } = getCredentials('standard');

    await login.abrir();
    await login.preencherCredenciais(username, 'senha_errada_de_proposito');
    await login.verificarMensagemErro('Username and password do not match');
  });

  test('Deve exigir usuário e senha preenchidos', async ({ page }) => {
    const login = new LoginPage(page);
    await login.abrir();
    await login.botaoLogin.click();
    await login.verificarMensagemErro('Username is required');
  });
});
