import { test, expect } from "@playwright/test";

// Nota: o app renderiza em inglês por padrão (localStorage vazio).
// Labels: "First Name", "Last Name", "Username", "Email", "Password", "Confirm Password"
// Erros Zod: em inglês via t() — "Passwords do not match", "You must accept the terms"

test.describe("Autenticação — Registro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login/register");
  });

  test("exibe todos os campos do formulário de registro", async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/^username/i)).toBeVisible();
    await expect(page.getByLabel(/^email/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();        // "Password" (não "Confirm Password")
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  });

  test("exibe erro quando senhas não coincidem", async ({ page }) => {
    await page.getByLabel(/first name/i).fill("João");
    await page.getByLabel(/last name/i).fill("Silva");
    await page.getByLabel(/^username/i).fill("joaosilva");
    await page.getByLabel(/^email/i).fill("joao@test.com");
    await page.getByLabel(/^password/i).fill("senha123");
    await page.getByLabel(/confirm password/i).fill("senha_diferente");
    await page.getByRole("button", { name: /create account/i }).click();

    // Mensagem em inglês via t(): "Passwords do not match"
    await expect(page.getByText(/do not match/i)).toBeVisible();
  });

  test("exibe erro ao não aceitar os termos", async ({ page }) => {
    await page.getByLabel(/first name/i).fill("João");
    await page.getByLabel(/last name/i).fill("Silva");
    await page.getByLabel(/^username/i).fill("joaosilva");
    await page.getByLabel(/^email/i).fill("joao@test.com");
    await page.getByLabel(/^password/i).fill("senha123");
    await page.getByLabel(/confirm password/i).fill("senha123");
    // Não marca os termos
    await page.getByRole("button", { name: /create account/i }).click();

    // Mensagem em inglês via t(): "You must accept the terms"
    await expect(page.getByText(/must accept/i)).toBeVisible();
  });

  test("link voltar para login navega corretamente", async ({ page }) => {
    // "Back to Login" é um <button> (MUI Link component="button")
    await page.getByRole("button", { name: /back to login/i }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
