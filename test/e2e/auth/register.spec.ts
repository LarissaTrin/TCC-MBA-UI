import { test, expect } from "@playwright/test";

test.describe("Autenticação — Registro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/register");
  });

  test("exibe todos os campos do formulário de registro", async ({ page }) => {
    await expect(page.getByLabel(/primeiro nome/i)).toBeVisible();
    await expect(page.getByLabel(/sobrenome/i)).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^senha/i)).toBeVisible();
    await expect(page.getByLabel(/confirmar senha/i)).toBeVisible();
  });

  test("exibe erro quando senhas não coincidem", async ({ page }) => {
    await page.getByLabel(/primeiro nome/i).fill("João");
    await page.getByLabel(/sobrenome/i).fill("Silva");
    await page.getByLabel(/username/i).fill("joaosilva");
    await page.getByLabel(/email/i).fill("joao@test.com");
    await page.getByLabel(/^senha/i).fill("senha123");
    await page.getByLabel(/confirmar senha/i).fill("senha_diferente");
    await page.getByRole("button", { name: /registrar|criar/i }).click();

    await expect(page.getByText(/coincidem/i)).toBeVisible();
  });

  test("exibe erro ao não aceitar os termos", async ({ page }) => {
    await page.getByLabel(/primeiro nome/i).fill("João");
    await page.getByLabel(/sobrenome/i).fill("Silva");
    await page.getByLabel(/username/i).fill("joaosilva");
    await page.getByLabel(/email/i).fill("joao@test.com");
    await page.getByLabel(/^senha/i).fill("senha123");
    await page.getByLabel(/confirmar senha/i).fill("senha123");
    // Não marca os termos
    await page.getByRole("button", { name: /registrar|criar/i }).click();

    await expect(page.getByText(/termos/i)).toBeVisible();
  });

  test("link voltar para login navega corretamente", async ({ page }) => {
    await page.getByRole("link", { name: /login|entrar/i }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
