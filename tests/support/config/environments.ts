// SauceDemo é um site público mantido pela Sauce Labs especificamente para
// prática de automação de testes — estável por design, não muda estrutura
// nem quebra com o tempo. Por isso não há múltiplos ambientes (dev/stg/prod)
// como em um projeto real de cliente: existe apenas um ambiente público fixo.
export const BASE_URL = 'https://www.saucedemo.com';

export function getBaseUrl(): string {
  return BASE_URL;
}
