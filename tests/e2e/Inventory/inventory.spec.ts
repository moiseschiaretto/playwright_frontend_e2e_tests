import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../support/pages/Inventory/inventoryPage';
import { ROUTES, PRODUCT_SLUGS } from '../../support/constants/routes.constants';

test.describe('Inventário de produtos', () => {
  test('Deve exibir a lista de produtos', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto(ROUTES.INVENTORY);
    await inventory.verificarListaVisivel(6);
  });

  test('Deve adicionar produto ao carrinho e atualizar o badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto(ROUTES.INVENTORY);

    expect(await inventory.obterQuantidadeNoCarrinho()).toBe(0);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    expect(await inventory.obterQuantidadeNoCarrinho()).toBe(1);
  });

  test('Deve ordenar produtos por preço (menor para maior)', { tag: '@desktop-only' }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto(ROUTES.INVENTORY);

    await inventory.ordenarPor('lohi');
    const precos = await inventory.obterPrecos();
    const precosOrdenados = [...precos].sort((a, b) => a - b);
    expect(precos).toEqual(precosOrdenados);
  });

  test('Deve ordenar produtos por nome (A a Z)', { tag: '@desktop-only' }, async ({ page }) => {
    const inventory = new InventoryPage(page);
    await page.goto(ROUTES.INVENTORY);

    await inventory.ordenarPor('az');
    const nomes = await page.locator('.inventory_item_name').allTextContents();
    const nomesOrdenados = [...nomes].sort((a, b) => a.localeCompare(b));
    expect(nomes).toEqual(nomesOrdenados);
  });
});
