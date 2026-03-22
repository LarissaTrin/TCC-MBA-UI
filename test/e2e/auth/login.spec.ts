import { test, expect } from "@playwright/test";

// Credenciais de teste — configure em variáveis de ambiente ou use um usuário dedicado
const TEST_EMAIL = process.env.TEST_EMAIL ?? "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "test123";

test.describe("Autenticação — Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("exibe o formulário de login", async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/senha/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
  });

  test("exibe erro inline para email inválido", async ({ page }) => {
    await page.getByLabel(/email/i).fill("email-invalido");
    await page.getByLabel(/senha/i).fill("123456");
    await page.getByRole("button", { name: /entrar/i }).click();
    // O React Hook Form + Zod deve mostrar erro de email
    await expect(page.getByText(/email válido/i)).toBeVisible();
  });

  test("exibe erro para senha muito curta", async ({ page }) => {
    await page.getByLabel(/email/i).fill("user@test.com");
    await page.getByLabel(/senha/i).fill("123");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/6 caracteres/i)).toBeVisible();
  });

  test("login com credenciais válidas redireciona para /home", async ({ page }) => {
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/senha/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL("**/home", { timeout: 10_000 });
    expect(page.url()).toContain("/home");
  });

  test("link para registro navega para /login/register", async ({ page }) => {
    await page.getByRole("link", { name: /registr/i }).click();
    await expect(page).toHaveURL(/register/);
  });

  test("link para esqueci senha navega para /login/forgot-password", async ({ page }) => {
    await page.getByRole("link", { name: /esqueci/i }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});
