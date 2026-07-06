import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
  FullConfig,
  Suite,
} from '@playwright/test/reporter';

// ---------------------------------------------------------------------------
// Reporter de console agrupado por dispositivo.
//
// Por que existe: o reporter padrão do Playwright ('list') imprime uma linha
// por teste na ordem em que os workers terminam — como os projetos
// (desktop/mobile/tablet) rodam em paralelo, as linhas de dispositivos
// diferentes ficam intercaladas, e o resultado no terminal fica "achatado"
// e difícil de ler.
//
// Este reporter guarda os resultados durante a execução e só imprime no
// final (onEnd), já organizado por dispositivo — igual à seção "Suítes" do
// Allure, mas direto no terminal, sem precisar abrir o navegador.
// ---------------------------------------------------------------------------

type Status = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';

interface TestRecord {
  title: string;
  status: Status;
  duration: number;
}

// Rótulos completos (usados nos cabeçalhos de cada grupo), no padrão
// "Nome (resolução)":
//   Desktop     (1920x1080)
//   Tablet      (768x1024)
//   Smartphone  (360x800)
//   iPhone 17   (402x874)
const DEVICE_LABELS: Record<string, string> = {
  'e2e-setup': '🔐 CONFIGURAÇÃO — Autenticação',
  desktop: '🖥️  DESKTOP (1920x1080)',
  mobile: '📱 RESPONSIVO — Smartphone (360x800)',
  tablet: '📐 RESPONSIVO — Tablet (768x1024)',
  iphone17: '📱 RESPONSIVO — iPhone 17 (402x874)',
};

// Rótulos curtos, só para a tabela de resumo (mantém as colunas alinhadas)
const SUMMARY_LABELS: Record<string, string> = {
  'e2e-setup': 'Setup (auth)',
  desktop: 'Desktop (1920x1080)',
  mobile: 'Smartphone (360x800)',
  tablet: 'Tablet (768x1024)',
  iphone17: 'iPhone 17 (402x874)',
};

// Ordem fixa de exibição, independente da ordem de conclusão dos workers
const DEVICE_ORDER = ['e2e-setup', 'desktop', 'mobile', 'tablet', 'iphone17'];

const STATUS_ICON: Record<Status, string> = {
  passed: '✓',
  failed: '✗',
  timedOut: '⏱',
  interrupted: '⚠',
  skipped: '○',
};

function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

class GroupedConsoleReporter implements Reporter {
  private resultsByProject = new Map<string, TestRecord[]>();
  private startTime = 0;

  onBegin(_config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    const totalTests = suite.allTests().length;
    console.log(`\n🎬 Iniciando suíte E2E — ${totalTests} testes ao todo\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const projectName = test.parent.project()?.name ?? 'desconhecido';
    const list = this.resultsByProject.get(projectName) ?? [];

    // Título sem o caminho do arquivo/projeto, só a descrição do teste
    const title = test.titlePath().slice(3).join(' › ') || test.title;

    list.push({ title, status: result.status as Status, duration: result.duration });
    this.resultsByProject.set(projectName, list);
  }

  onEnd(result: FullResult) {
    // Imprime cada dispositivo na ordem fixa definida em DEVICE_ORDER,
    // e qualquer projeto extra que não esteja mapeado, no final.
    const knownProjects = DEVICE_ORDER.filter((p) => this.resultsByProject.has(p));
    const extraProjects = [...this.resultsByProject.keys()].filter(
      (p) => !DEVICE_ORDER.includes(p),
    );
    const orderedProjects = [...knownProjects, ...extraProjects];

    for (const projectName of orderedProjects) {
      const tests = this.resultsByProject.get(projectName)!;
      const label = DEVICE_LABELS[projectName] ?? projectName.toUpperCase();

      console.log(`\n${label}`);
      for (const t of tests) {
        const icon = STATUS_ICON[t.status] ?? '?';
        console.log(`   ${icon} ${t.title} (${formatDuration(t.duration)})`);
      }
    }

    // Resumo final por dispositivo
    console.log('\n📊 RESUMO POR DISPOSITIVO');
    console.log('─'.repeat(64));

    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (const projectName of orderedProjects) {
      const tests = this.resultsByProject.get(projectName)!;
      const passed = tests.filter((t) => t.status === 'passed').length;
      const failed = tests.filter((t) => t.status === 'failed' || t.status === 'timedOut').length;
      const skipped = tests.filter((t) => t.status === 'skipped').length;
      const projectDuration = tests.reduce((sum, t) => sum + t.duration, 0);

      totalPassed += passed;
      totalFailed += failed;
      totalSkipped += skipped;

      const label = SUMMARY_LABELS[projectName] ?? projectName;
      console.log(
        `  ${label.padEnd(24)} ✓ ${String(passed).padStart(2)}   ✗ ${String(failed).padStart(2)}   ○ ${String(skipped).padStart(2)}   (${formatDuration(projectDuration)})`,
      );
    }

    console.log('─'.repeat(64));
    const totalDuration = Date.now() - this.startTime;
    console.log(
      `  ${'TOTAL'.padEnd(24)} ✓ ${String(totalPassed).padStart(2)}   ✗ ${String(totalFailed).padStart(2)}   ○ ${String(totalSkipped).padStart(2)}   (${formatDuration(totalDuration)})`,
    );

    const statusIcon = result.status === 'passed' ? '✅' : '❌';
    console.log(`\n${statusIcon} Execução finalizada — status: ${result.status}\n`);
  }
}

export default GroupedConsoleReporter;
