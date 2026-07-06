import { z } from 'zod';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const CheckoutDataSchema = z.object({
  nome: z.string().min(1),
  sobrenome: z.string().min(1),
  cep: z.string().min(1),
});

const TestDataSchema = z.object({
  checkout: CheckoutDataSchema,
});

export type TestData = z.infer<typeof TestDataSchema>;

/**
 * Carrega tests/fixtures/testData.json (gitignored) com fallback pro
 * testData.example.json (commitado) — mesmo padrão usado em projetos reais,
 * mesmo os dados aqui não sendo sensíveis (é só nome/CEP de teste).
 */
export function loadTestData(): TestData {
  const fixturesDir = path.resolve(process.cwd(), 'tests/fixtures');
  const realPath = path.join(fixturesDir, 'testData.json');
  const examplePath = path.join(fixturesDir, 'testData.example.json');

  let raw: string;
  try {
    raw = readFileSync(realPath, 'utf-8');
  } catch {
    raw = readFileSync(examplePath, 'utf-8');
  }

  return TestDataSchema.parse(JSON.parse(raw));
}
