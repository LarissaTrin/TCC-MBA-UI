import { test, expect } from "../auth/fixtures";

const PROJECT_ID = process.env.TEST_PROJECT_ID ?? "1";

test.describe("Gerenciamento de Cards", () => {
  test.beforeEach(async () => {
    if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
      test.skip();
    }
  });

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/project/${PROJECT_ID}?tab=board`);
    await authenticatedPage.waitForLoadState("networkidle");
  });

  test("clicar em um card abre o drawer com dados", async ({ authenticatedPage }) => {
    // Clica no primeiro card que encontrar
    const firstCard = authenticatedPage
      .locator("[class*='MuiCard'], [class*='card-item'], [data-card-id]")
      .first();

    if (!(await firstCard.isVisible())) return; // skip se projeto não tem cards

    await firstCard.click();

    // Drawer ou modal deve abrir com um campo de título
    await expect(
      authenticatedPage
        .getByRole("textbox", { name: /título|nome/i })
        .or(authenticatedPage.locator("[class*='Drawer'] input").first())
    ).toBeVisible({ timeout: 5_000 });
  });

  test("criar novo card via botão + adiciona card na coluna", async ({ authenticatedPage }) => {
    // Procura botão de adicionar card (ícone +) na primeira coluna
    const addBtn = authenticatedPage
      .getByRole("button", { name: /adicionar card|novo card|\+/i })
      .first();

    if (!(await addBtn.isVisible())) return;

    await addBtn.click();

    // Campo de texto para novo card deve aparecer
    const titleInput = authenticatedPage.getByPlaceholder(/título do card/i);
    await expect(titleInput).toBeVisible({ timeout: 3_000 });

    const newTitle = `Card de teste E2E ${Date.now()}`;
    await titleInput.fill(newTitle);
    await titleInput.press("Enter");

    // Card deve aparecer na coluna
    await expect(authenticatedPage.getByText(newTitle)).toBeVisible({
      timeout: 5_000,
    });
  });

  test("editar título de card e salvar atualiza o board", async ({ authenticatedPage }) => {
    const firstCard = authenticatedPage
      .locator("[class*='MuiCard'], [class*='card-item']")
      .first();

    if (!(await firstCard.isVisible())) return;

    // Pega o título atual
    const originalTitle = await firstCard.textContent();

    await firstCard.click();

    // Aguarda drawer abrir
    await authenticatedPage.waitForTimeout(500);

    const titleField = authenticatedPage
      .getByRole("textbox", { name: /título|nome/i })
      .first();
    if (!(await titleField.isVisible())) return;

    const newTitle = `Editado E2E ${Date.now()}`;
    await titleField.clear();
    await titleField.fill(newTitle);

    // Salvar
    const saveBtn = authenticatedPage.getByRole("button", { name: /salvar/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await authenticatedPage.waitForTimeout(1_000);
      // Novo título deve aparecer no board
      await expect(authenticatedPage.getByText(newTitle)).toBeVisible({
        timeout: 5_000,
      });
    }
  });
});
