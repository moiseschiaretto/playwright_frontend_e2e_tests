import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get listaProdutos() {
    return this.page.locator('.inventory_item');
  }

  get seletorOrdenacao() {
    return this.page.locator('[data-test="product-sort-container"]');
  }

  get iconeCarrinho() {
    return this.page.locator('.shopping_cart_link');
  }

  get badgeCarrinho() {
    return this.page.locator('.shopping_cart_badge');
  }

  botaoAdicionar(produtoSlug: string) {
    return this.page.locator(`[data-test="add-to-cart-${produtoSlug}"]`);
  }

  async adicionarAoCarrinho(produtoSlug: string): Promise<void> {
    await this.botaoAdicionar(produtoSlug).click();
  }

  async ordenarPor(opcao: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.seletorOrdenacao.selectOption(opcao);
  }

  async obterPrecos(): Promise<number[]> {
    const textos = await this.page.locator('.inventory_item_price').allTextContents();
    return textos.map((t) => Number(t.replace('$', '')));
  }

  async obterQuantidadeNoCarrinho(): Promise<number> {
    if (!(await this.badgeCarrinho.isVisible())) return 0;
    return Number(await this.badgeCarrinho.textContent());
  }

  async irParaCarrinho(): Promise<void> {
    await this.iconeCarrinho.click();
  }

  async verificarListaVisivel(quantidadeMinima = 1): Promise<void> {
    await expect(this.listaProdutos.first()).toBeVisible();
    expect(await this.listaProdutos.count()).toBeGreaterThanOrEqual(quantidadeMinima);
  }
}
