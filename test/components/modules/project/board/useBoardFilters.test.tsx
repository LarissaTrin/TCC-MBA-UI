import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { renderHook, act } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBoardFilters } from "@/components/modules/project/board/useBoardFilters";
import { buildCard, buildCardList } from "../../../../mocks/factories";
import { mapCardsToTasks } from "@/common/utils/cardMapper";

const feature = loadFeature(path.join(__dirname, "useBoardFilters.feature"));

const mockReplace = jest.fn();

jest.mock("@/common/hooks", () => ({
  useProjectTagSearch: jest.fn(() => ({
    options: [],
    loading: false,
    search: jest.fn(),
  })),
  useProjectMemberSearch: jest.fn(() => ({
    options: [],
    loading: false,
    search: jest.fn(),
    seedOption: jest.fn(),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
});

defineFeature(feature, (test) => {
  test("Retorna todas as tasks quando nenhum filtro está ativo", ({ given, when, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given("um conjunto de tasks carregadas sem filtros na URL", () => {
      tasks = mapCardsToTasks(buildCardList(5));
    });

    when("useBoardFilters é renderizado", () => {
      hook = renderHook(() => useBoardFilters(tasks));
    });

    then("filteredTasks deve conter todas as tasks", () => {
      expect(hook.result.current.filteredTasks).toHaveLength(tasks.length);
    });
  });

  test("isFiltered é false quando não há filtros aplicados", ({ given, when, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given("um conjunto de tasks carregadas sem filtros na URL", () => {
      tasks = mapCardsToTasks(buildCardList(5));
    });

    when("useBoardFilters é renderizado", () => {
      hook = renderHook(() => useBoardFilters(tasks));
    });

    then("isFiltered deve ser false", () => {
      expect(hook.result.current.isFiltered).toBe(false);
    });
  });

  test("Filtra tasks por texto via parâmetro search na URL", ({ given, when, and, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given("tasks com títulos \"Tela pagamento\" e \"Dashboard admin\"", () => {
      tasks = mapCardsToTasks([
        buildCard({ id: 1, name: "Tela pagamento" }),
        buildCard({ id: 2, name: "Dashboard admin" }),
      ]);
    });

    and(/o parâmetro search "(.*)" está na URL/, (search: string) => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`search=${search}`));
    });

    when("useBoardFilters é renderizado", () => {
      hook = renderHook(() => useBoardFilters(tasks));
    });

    then(/filteredTasks deve conter apenas a task "(.*)"/, (title: string) => {
      expect(hook.result.current.filteredTasks).toHaveLength(1);
      expect(hook.result.current.filteredTasks[0].title).toBe(title);
    });
  });

  test("isFiltered é true quando há parâmetro search na URL", ({ given, when, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given(/o parâmetro search "(.*)" está na URL/, (search: string) => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`search=${search}`));
      tasks = mapCardsToTasks(buildCardList(5));
    });

    when("useBoardFilters é renderizado com qualquer lista de tasks", () => {
      hook = renderHook(() => useBoardFilters(tasks));
    });

    then("isFiltered deve ser true", () => {
      expect(hook.result.current.isFiltered).toBe(true);
    });
  });

  test("handleApply atualiza a URL com os parâmetros do formulário", ({ given, when, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given("um conjunto de tasks carregadas sem filtros na URL", () => {
      tasks = mapCardsToTasks(buildCardList(5));
      hook = renderHook(() => useBoardFilters(tasks));
    });

    when(/handleApply é chamado com search "(.*)"/, (search: string) => {
      act(() => {
        hook.result.current.form.setValue("search", search);
        hook.result.current.handleApply();
      });
    });

    then(/router.replace deve ser chamado com "(.*)" na URL/, (param: string) => {
      expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining(param));
    });
  });

  test("resetFilters remove parâmetros de filtro preservando tab", ({ given, when, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given(/filtros ativos "(.*)" e parâmetro "(.*)" na URL/, (filters: string, tab: string) => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams(`${filters}&${tab}`)
      );
      tasks = mapCardsToTasks(buildCardList(5));
      hook = renderHook(() => useBoardFilters(tasks));
    });

    when("resetFilters é chamado", () => {
      act(() => {
        hook.result.current.resetFilters();
      });
    });

    then(/router.replace deve ser chamado sem "(.*)" mas com "(.*)"/, (absent: string, present: string) => {
      const calledWith = mockReplace.mock.calls[0][0] as string;
      expect(calledWith).not.toContain(absent);
      expect(calledWith).toContain(present);
    });
  });

  test("Filtra tasks por usuário via parâmetro users na URL", ({ given, when, and, then }) => {
    let tasks: ReturnType<typeof mapCardsToTasks>;
    let hook: ReturnType<typeof renderHook>;

    given("tasks atribuídas aos usuários com id 5 e id 6", () => {
      tasks = mapCardsToTasks([
        buildCard({ id: 1, user: { id: 5, firstName: "Alice", lastName: "A", email: "a@test.com" } }),
        buildCard({ id: 2, user: { id: 6, firstName: "Bob", lastName: "B", email: "b@test.com" } }),
      ]);
    });

    and(/o parâmetro users "(.*)" está na URL/, (userId: string) => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(`users=${userId}`));
    });

    when("useBoardFilters é renderizado", () => {
      hook = renderHook(() => useBoardFilters(tasks));
    });

    then(/filteredTasks deve conter apenas a task do usuário (\d+)/, (userId: string) => {
      expect(hook.result.current.filteredTasks).toHaveLength(1);
      expect(hook.result.current.filteredTasks[0].userId).toBe(Number(userId));
    });
  });
});
