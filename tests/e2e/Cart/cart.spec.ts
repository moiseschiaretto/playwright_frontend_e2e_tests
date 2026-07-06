import { test } from '@playwright/test';
import { InventoryPage } from '../../support/pages/Inventory/inventoryPage';
import { CartPage } from '../../support/pages/Cart/cartPage';
import { ROUTES, PRODUCT_SLUGS, PRODUCT_NAMES } from '../../support/constants/routes.constants';

test.describe('Carrinho de compras', () => {
  test('Deve exibir produto adicionado no carrinho', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await page.goto(ROUTES.INVENTORY);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.irParaCarrinho();

    await cart.verificarQuantidadeItens(1);
    await cart.verificarProdutoPresente(PRODUCT_NAMES.BACKPACK);
  });

  test('Deve remover produto do carrinho', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await page.goto(ROUTES.INVENTORY);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.irParaCarrinho();

    await cart.removerProduto(PRODUCT_SLUGS.BACKPACK);
    await cart.verificarQuantidadeItens(0);
  });

  test('Deve adicionar múltiplos produtos e refletir no badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await page.goto(ROUTES.INVENTORY);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BIKE_LIGHT);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BOLT_T_SHIRT);

    await inventory.irParaCarrinho();
    await cart.verificarQuantidadeItens(3);
  });
});
