import { test, expect } from "@playwright/test";

// Credenciais de teste — configure em variáveis de ambiente ou use um usuário dedicado
const TEST_EMAIL = process.env.TEST_EMAIL ?? "test@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "test123";

// Nota: o app renderiza em inglês por padrão (localStorage vazio = sem preferência de idioma).
// Labels da UI estão em inglês. Mensagens de erro do Zod do loginSchema estão em PT (hardcoded).

test.describe("Autenticação — Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("exibe o formulário de login", async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();        // "Email Address"
    await expect(page.getByLabel(/^password/i)).toBeVisible();    // "Password"
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("exibe erro inline para email inválido", async ({ page }) => {
    await page.getByLabel(/email/i).fill("email-invalido");
    await page.getByLabel(/^password/i).fill("123456");
    // Desabilita validação nativa do browser para que o Zod/RHF possa exibir o erro
    await page.evaluate(() => {
      document.querySelector("form")?.setAttribute("novalidate", "true");
    });
    await page.getByRole("button", { name: /sign in/i }).click();
    // loginSchema tem mensagem PT hardcoded: "Por favor, insira um email válido."
    await expect(page.getByText(/email válido/i)).toBeVisible();
  });

  test("exibe erro para senha muito curta", async ({ page }) => {
    await page.getByLabel(/email/i).fill("user@test.com");
    await page.getByLabel(/^password/i).fill("123");
    await page.getByRole("button", { name: /sign in/i }).click();
    // loginSchema tem mensagem PT hardcoded: "A senha deve ter no mínimo 6 caracteres."
    await expect(page.getByText(/6 caracteres/i)).toBeVisible();
  });

  test("login com credenciais válidas redireciona para /home", async ({ page }) => {
    test.skip(
      !process.env.TEST_EMAIL || !process.env.TEST_PASSWORD,
      "Requer TEST_EMAIL e TEST_PASSWORD configurados com usuário real no backend"
    );
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/^password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/home", { timeout: 10_000 });
    expect(page.url()).toContain("/home");
  });

  test("link para registro navega para /login/register", async ({ page }) => {
    // "Sign up" é um <button> (MUI Link component="button")
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page).toHaveURL(/register/);
  });

  test("link para esqueci senha navega para /login/forgot-password", async ({ page }) => {
    // "Forgot password?" é um <button> (MUI Link component="button")
    await page.getByRole("button", { name: /forgot/i }).click();
    await expect(page).toHaveURL(/forgot-password/);
  });
});
