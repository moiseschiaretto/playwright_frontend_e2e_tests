import { z } from 'zod';

const CredentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type Credentials = z.infer<typeof CredentialsSchema>;

/**
 * Usuários de demonstração PUBLICADOS OFICIALMENTE pela Sauce Labs na tela de
 * login do próprio SauceDemo (https://www.saucedemo.com) — não são segredo,
 * servem justamente para permitir testar múltiplos cenários de autenticação.
 * A senha é a mesma para todos os usuários: "secret_sauce".
 */
export type UserType =
  | 'standard'
  | 'lockedOut'
  | 'problem'
  | 'performanceGlitch'
  | 'error'
  | 'visual';

const DEMO_USERS: Record<UserType, string> = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
};

const DEMO_PASSWORD = 'secret_sauce';

export function getCredentials(userType: UserType = 'standard'): Credentials {
  // Permite sobrescrever via .env (útil se você apontar o projeto pra outro
  // ambiente que exija credenciais reais no futuro), com fallback pros
  // usuários públicos de demonstração.
  if (userType === 'standard' && process.env.TEST_USERNAME && process.env.TEST_PASSWORD) {
    return CredentialsSchema.parse({
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    });
  }

  return CredentialsSchema.parse({
    username: DEMO_USERS[userType],
    password: DEMO_PASSWORD,
  });
}
