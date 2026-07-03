import { test } from '@playwright/test';
import { InventoryPage } from '../../support/pages/Inventory/inventoryPage';
import { CartPage } from '../../support/pages/Cart/cartPage';
import { CheckoutPage } from '../../support/pages/Checkout/checkoutPage';
import { ROUTES, PRODUCT_SLUGS } from '../../support/constants/routes.constants';
import { loadTestData } from '../../support/schemas';

test.describe('Checkout', () => {
  test('Deve concluir a compra com dados válidos', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const { checkout: dadosCheckout } = loadTestData();

    await page.goto(ROUTES.INVENTORY);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.irParaCarrinho();
    await cart.iniciarCheckout();

    await checkout.preencherDadosEntrega(dadosCheckout);
    await checkout.finalizarCompra();
    await checkout.verificarCompraConcluida();
  });

  test('Deve bloquear checkout sem preencher o nome', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const { checkout: dadosCheckout } = loadTestData();

    await page.goto(ROUTES.INVENTORY);
    await inventory.adicionarAoCarrinho(PRODUCT_SLUGS.BACKPACK);
    await inventory.irParaCarrinho();
    await cart.iniciarCheckout();

    await checkout.campoSobrenome.fill(dadosCheckout.sobrenome);
    await checkout.campoCep.fill(dadosCheckout.cep);
    await checkout.botaoContinuar.click();

    await checkout.verificarErroValidacao('First Name is required');
  });
});
