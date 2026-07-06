import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get itensCarrinho() {
    return this.page.locator('.cart_item');
  }

  get botaoCheckout() {
    return this.page.locator('[data-test="checkout"]');
  }

  get botaoContinuarComprando() {
    return this.page.locator('[data-test="continue-shopping"]');
  }

  botaoRemover(produtoSlug: string) {
    return this.page.locator(`[data-test="remove-${produtoSlug}"]`);
  }

  async removerProduto(produtoSlug: string): Promise<void> {
    await this.botaoRemover(produtoSlug).click();
  }

  async iniciarCheckout(): Promise<void> {
    await this.botaoCheckout.click();
  }

  async verificarQuantidadeItens(esperado: number): Promise<void> {
    await expect(this.itensCarrinho).toHaveCount(esperado);
  }

  async verificarProdutoPresente(nomeProduto: string): Promise<void> {
    await expect(this.page.locator('.inventory_item_name', { hasText: nomeProduto })).toBeVisible();
  }
}
