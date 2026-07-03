export const ROUTES = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
} as const;

// Slugs de produto usados pela SauceDemo nos atributos data-test
// (ex.: [data-test="add-to-cart-sauce-labs-backpack"])
export const PRODUCT_SLUGS = {
  BACKPACK: 'sauce-labs-backpack',
  BIKE_LIGHT: 'sauce-labs-bike-light',
  BOLT_T_SHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE_JACKET: 'sauce-labs-fleece-jacket',
  ONESIE: 'sauce-labs-onesie',
  RED_T_SHIRT: 'test.allthethings()-t-shirt-(red)',
} as const;

export const PRODUCT_NAMES = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_T_SHIRT: 'Sauce Labs Bolt T-Shirt',
} as const;
