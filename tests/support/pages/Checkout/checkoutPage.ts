import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export interface DadosCheckout {
  nome: string;
  sobrenome: string;
  cep: string;
}

export class CheckoutPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get campoNome() {
    return this.page.locator('[data-test="firstName"]');
  }

  get campoSobrenome() {
    return this.page.locator('[data-test="lastName"]');
  }

  get campoCep() {
    return this.page.locator('[data-test="postalCode"]');
  }

  get botaoContinuar() {
    return this.page.locator('[data-test="continue"]');
  }

  get botaoFinalizar() {
    return this.page.locator('[data-test="finish"]');
  }

  get mensagemErro() {
    return this.page.locator('[data-test="error"]');
  }

  get mensagemSucesso() {
    return this.page.locator('.complete-header');
  }

  get resumoTotal() {
    return this.page.locator('.summary_total_label');
  }

  async preencherDadosEntrega(dados: DadosCheckout): Promise<void> {
    await this.campoNome.fill(dados.nome);
    await this.campoSobrenome.fill(dados.sobrenome);
    await this.campoCep.fill(dados.cep);
    await this.botaoContinuar.click();
  }

  async finalizarCompra(): Promise<void> {
    await this.botaoFinalizar.click();
  }

  async verificarCompraConcluida(): Promise<void> {
    await expect(this.mensagemSucesso).toBeVisible();
    await expect(this.mensagemSucesso).toContainText('Thank you');
  }

  async verificarErroValidacao(textoEsperado: string): Promise<void> {
    await expect(this.mensagemErro).toBeVisible();
    await expect(this.mensagemErro).toContainText(textoEsperado);
  }
}
