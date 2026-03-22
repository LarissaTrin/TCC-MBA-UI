import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Carrega variáveis de .env.local (credenciais de teste, IDs de projeto, etc.)
dotenv.config({ path: path.join(__dirname, ".env.local") });

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: false, // run sequentially to avoid port conflicts
  retries: 1,
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:3000",
    // headless: false → abre o browser na tela para visualizar as execuções
    headless: false,
    // Grava vídeo de todos os testes — salvo em test-results/
    video: "on",
    // Gera trace (timeline de actions + network + console) na primeira falha
    trace: "on-first-retry",
    // Screenshot apenas em falha
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Sobe o servidor de desenvolvimento automaticamente antes dos testes
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI, // em CI sempre reinicia; local reutiliza
    timeout: 60_000,
  },

  // Onde os artefatos (vídeos, traces, screenshots) são salvos
  outputDir: "test-results",

  // Reporter: lista cada teste no terminal + HTML report
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
});
