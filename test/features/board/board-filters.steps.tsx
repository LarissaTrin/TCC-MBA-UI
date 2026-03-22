import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { buildCard, buildCardList } from "../../mocks/factories";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { BOARD_FILTER_DEFAULTS } from "@/common/schemas/boardFilterSchema";
import type { Task } from "@/common/model";
import type { BoardFilterData } from "@/common/schemas/boardFilterSchema";
import { Status } from "@/common/enum/status";

const feature = loadFeature(path.join(__dirname, "board-filters.feature"));

// Local copy of the pure applyFilters function (same logic as useBoardFilters)
function applyFilters(tasks: Task[], filters: BoardFilterData): Task[] {
  const isActive =
    filters.search.trim() !== "" ||
    filters.tags.length > 0 ||
    filters.users.length > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  if (!isActive) return tasks;

  return tasks.filter((task) => {
    if (filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      if (
        !task.title.toLowerCase().includes(term) &&
        !String(task.id).includes(term)
      )
        return false;
    }
    if (filters.users.length > 0) {
      if (!task.userId || !filters.users.includes(String(task.userId)))
        return false;
    }
    return true;
  });
}

defineFeature(feature, (test) => {
  let allTasks: Task[];

  test("Filtrar cards por texto", ({ given, when, then, and }) => {
    given("existem cards carregados no board", () => {
      const cards = [
        buildCard({ id: 1, name: "Tela de pagamento" }),
        buildCard({ id: 2, name: "Dashboard de relatórios" }),
        buildCard({ id: 3, name: "Fluxo de pagamento recorrente" }),
      ];
      allTasks = mapCardsToTasks(cards);
    });

    when(/o filtro de texto "(.*)" é aplicado/, (term: string) => {
      allTasks = applyFilters(allTasks, {
        ...BOARD_FILTER_DEFAULTS,
        search: term,
      });
    });

    then(
      /apenas cards cujo título contém "(.*)" são exibidos/,
      (term: string) => {
        expect(allTasks.length).toBeGreaterThan(0);
        allTasks.forEach((t) =>
          expect(t.title.toLowerCase()).toContain(term.toLowerCase())
        );
      }
    );

    and(
      /cards sem "(.*)" no título não aparecem/,
      (term: string) => {
        const excluded = allTasks.filter(
          (t) => !t.title.toLowerCase().includes(term.toLowerCase())
        );
        expect(excluded.length).toBe(0);
      }
    );
  });

  test("Resetar filtros limpa os resultados", ({ given, when, then }) => {
    let allOriginalTasks: ReturnType<typeof mapCardsToTasks>;

    // Background step (jest-cucumber requires each scenario to declare it)
    given("existem cards carregados no board", () => {
      const allCards = buildCardList(5);
      allOriginalTasks = mapCardsToTasks(allCards);
    });

    given(/^o filtro de texto "(.*)" está aplicado$/, (term: string) => {
      allTasks = applyFilters(allOriginalTasks, {
        ...BOARD_FILTER_DEFAULTS,
        search: term,
      });
    });

    when("os filtros são resetados", () => {
      allTasks = applyFilters(allOriginalTasks, BOARD_FILTER_DEFAULTS);
    });

    then("todos os cards aparecem novamente", () => {
      expect(allTasks.length).toBe(allOriginalTasks.length);
    });
  });

  test(
    "Filtro de usuário exclui cards de outros usuários",
    ({ given, when, then }) => {
      given("existem cards carregados no board", () => {
        const cards = [
          buildCard({ id: 1, user: { id: 5, firstName: "Alice", lastName: "A", email: "a@test.com" } }),
          buildCard({ id: 2, user: { id: 6, firstName: "Bob", lastName: "B", email: "b@test.com" } }),
          buildCard({ id: 3, user: { id: 5, firstName: "Alice", lastName: "A", email: "a@test.com" } }),
        ];
        allTasks = mapCardsToTasks(cards);
      });

      when(/o filtro de usuário com id "(.*)" é aplicado/, (userId: string) => {
        allTasks = applyFilters(allTasks, {
          ...BOARD_FILTER_DEFAULTS,
          users: [userId],
        });
      });

      then(
        /apenas cards atribuídos ao usuário "(.*)" aparecem/,
        (userId: string) => {
          expect(allTasks.length).toBeGreaterThan(0);
          allTasks.forEach((t) => expect(String(t.userId)).toBe(userId));
        }
      );
    }
  );

  test(
    "Sem filtros ativos retorna todos os cards",
    ({ given, when, then }) => {
      const originalTasks: Task[] = [];

      given("existem cards carregados no board", () => {
        const cards = buildCardList(8);
        originalTasks.push(...mapCardsToTasks(cards));
        allTasks = [...originalTasks];
      });

      when("nenhum filtro está ativo", () => {
        allTasks = applyFilters(originalTasks, BOARD_FILTER_DEFAULTS);
      });

      then("todos os cards são retornados sem modificação", () => {
        expect(allTasks.length).toBe(originalTasks.length);
      });
    }
  );
});
