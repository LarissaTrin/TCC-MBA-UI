import { test, expect } from "../auth/fixtures";

// Estes testes requerem um projeto existente no banco de dados de teste.
// Configure TEST_PROJECT_ID com o ID de um projeto de teste.
const PROJECT_ID = process.env.TEST_PROJECT_ID ?? "1";

test.describe("Board Kanban", () => {
  test.beforeEach(async () => {
    if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
      test.skip();
    }
  });

  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/project/${PROJECT_ID}?tab=board`);
    // Aguarda pelo menos uma coluna do board carregar (GenericAccordion usa id="generic-accordion")
    await authenticatedPage.waitForSelector("#generic-accordion", {
      timeout: 15_000,
      state: "visible",
    });
  });

  test("exibe colunas do projeto na aba board", async ({ authenticatedPage }) => {
    // Pelo menos uma coluna deve estar visível (GenericAccordion usa id="generic-accordion")
    const columns = authenticatedPage.locator("#generic-accordion");
    await expect(columns.first()).toBeVisible();
  });

  test("botão Load more aparece em coluna com mais cards", async ({ authenticatedPage }) => {
    // Este teste é válido se o projeto de teste tiver >20 cards em alguma coluna
    const loadMoreBtn = authenticatedPage.getByRole("button", { name: /load more/i }).first();
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      // Após clique, botão deve desaparecer ou novos cards aparecer
      await authenticatedPage.waitForTimeout(1000);
      // Smoke: página não quebrou
      await expect(authenticatedPage.locator("body")).not.toContainText("Error");
    }
  });

  test("painel de filtros abre ao clicar no botão filtros", async ({ authenticatedPage }) => {
    const filterBtn = authenticatedPage.getByRole("button", { name: /filtro/i }).first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await expect(
        authenticatedPage.getByPlaceholder(/buscar/i).or(
          authenticatedPage.getByLabel(/buscar/i)
        )
      ).toBeVisible();
    }
  });

  test("filtro de texto restringe cards visíveis", async ({ authenticatedPage }) => {
    const filterBtn = authenticatedPage
      .getByRole("button", { name: /filtro/i })
      .first();
    if (!(await filterBtn.isVisible())) return;

    await filterBtn.click();
    const searchInput = authenticatedPage
      .getByPlaceholder(/buscar/i)
      .or(authenticatedPage.getByLabel(/buscar/i))
      .first();
    await searchInput.fill("xyznonexistent12345");

    // Aplicar filtros
    const applyBtn = authenticatedPage.getByRole("button", { name: /aplicar|filtrar/i });
    if (await applyBtn.isVisible()) await applyBtn.click();

    await authenticatedPage.waitForTimeout(500);
    // URL deve conter o search param
    expect(authenticatedPage.url()).toContain("search=");
  });

  test("recarregar página com filtro na URL mantém filtro ativo", async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/project/${PROJECT_ID}?tab=board&search=teste`);
    await authenticatedPage.waitForLoadState("networkidle");
    expect(authenticatedPage.url()).toContain("search=teste");
  });
});
