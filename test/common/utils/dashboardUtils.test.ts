import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import {
  PRIORITY_LABEL,
  buildByListChart,
  buildByPriorityChart,
  buildByTagChart,
  buildBurndownChart,
} from "@/common/utils/dashboardUtils";
import type {
  ProjectStatsResponse,
  BurndownResponse,
} from "@/common/model/dashboard";

const feature = loadFeature(path.join(__dirname, "dashboardUtils.feature"));

const makeStats = (overrides: Partial<ProjectStatsResponse> = {}): ProjectStatsResponse => ({
  totalCards: 10,
  completedCards: 3,
  byList: [
    { listName: "To Do", count: 5, isFinal: false },
    { listName: "Done", count: 5, isFinal: true },
  ],
  byPriority: [
    { priority: 1, count: 2 },
    { priority: 3, count: 5 },
    { priority: null, count: 3 },
  ],
  byTag: [
    { tagName: "backend", count: 4 },
    { tagName: "frontend", count: 6 },
  ],
  ...overrides,
});

const makeBurndown = (): BurndownResponse => ({
  points: [
    { date: "2026-01-01", remaining: 10, ideal: 10 },
    { date: "2026-01-02", remaining: 8, ideal: 7 },
    { date: "2026-01-03", remaining: 5, ideal: 4 },
  ],
});

defineFeature(feature, (test) => {
  test("PRIORITY_LABEL cobre todas as 5 prioridades", ({ given, when, then }) => {
    given("o mapeamento PRIORITY_LABEL", () => {});
    when("verifico os rótulos das prioridades 1 a 5", () => {});
    then("os rótulos devem ser \"Muito baixa\", \"Baixa\", \"Média\", \"Alta\" e \"Muito alta\"", () => {
      expect(PRIORITY_LABEL[1]).toBe("Muito baixa");
      expect(PRIORITY_LABEL[2]).toBe("Baixa");
      expect(PRIORITY_LABEL[3]).toBe("Média");
      expect(PRIORITY_LABEL[4]).toBe("Alta");
      expect(PRIORITY_LABEL[5]).toBe("Muito alta");
    });
  });

  test("buildByListChart retorna opções de gráfico de barras", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByListChart>;

    given("um stats com duas listas \"To Do\" e \"Done\"", () => {});

    when("buildByListChart é chamado", () => {
      chart = buildByListChart(makeStats());
    });

    then("o tipo do gráfico deve ser \"bar\" com os dados e categorias corretos", () => {
      expect(chart.chart?.type).toBe("bar");
      expect((chart.series as { data: number[] }[])[0].data).toEqual([5, 5]);
      expect(chart.xaxis?.categories).toEqual(["To Do", "Done"]);
    });
  });

  test("buildByListChart colore a lista final diferente", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByListChart>;

    given("um stats com lista final \"Done\"", () => {});

    when("buildByListChart é chamado", () => {
      chart = buildByListChart(makeStats());
    });

    then("as cores devem incluir azul para lista normal e verde para lista final", () => {
      expect(chart.colors).toEqual(["#1976d2", "#2e7d32"]);
    });
  });

  test("buildByListChart lida com byList vazio", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByListChart>;

    given("um stats com byList vazio", () => {});

    when("buildByListChart é chamado", () => {
      chart = buildByListChart(makeStats({ byList: [] }));
    });

    then("o array de dados deve ser vazio", () => {
      expect((chart.series as { data: number[] }[])[0].data).toEqual([]);
    });
  });

  test("buildByPriorityChart retorna gráfico de barras com rótulos de prioridade", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByPriorityChart>;

    given("um stats com prioridades 1, 3 e null", () => {});

    when("buildByPriorityChart é chamado", () => {
      chart = buildByPriorityChart(makeStats());
    });

    then("as categorias devem conter \"Muito baixa\", \"Média\" e \"Sem prioridade\"", () => {
      expect(chart.chart?.type).toBe("bar");
      const categories = chart.xaxis?.categories as string[];
      expect(categories).toContain("Muito baixa");
      expect(categories).toContain("Média");
      expect(categories).toContain("Sem prioridade");
    });
  });

  test("buildByPriorityChart ordena prioridade null por último", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByPriorityChart>;

    given("um stats com prioridade null presente", () => {});

    when("buildByPriorityChart é chamado", () => {
      chart = buildByPriorityChart(makeStats());
    });

    then("a última categoria deve ser \"Sem prioridade\"", () => {
      const categories = chart.xaxis?.categories as string[];
      expect(categories[categories.length - 1]).toBe("Sem prioridade");
    });
  });

  test("buildByPriorityChart usa fallback para prioridade desconhecida", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByPriorityChart>;

    given("um stats com prioridade desconhecida 9", () => {});

    when("buildByPriorityChart é chamado", () => {
      chart = buildByPriorityChart(makeStats({ byPriority: [{ priority: 9, count: 1 }] }));
    });

    then("a primeira categoria deve ser \"P9\"", () => {
      const categories = chart.xaxis?.categories as string[];
      expect(categories[0]).toBe("P9");
    });
  });

  test("buildByTagChart retorna opções de gráfico donut", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByTagChart>;

    given("um stats com tags \"backend\" e \"frontend\"", () => {});

    when("buildByTagChart é chamado", () => {
      chart = buildByTagChart(makeStats());
    });

    then("o tipo deve ser \"donut\" com series e labels corretos", () => {
      expect(chart.chart?.type).toBe("donut");
      expect(chart.series).toEqual([4, 6]);
      expect(chart.labels).toEqual(["backend", "frontend"]);
    });
  });

  test("buildByTagChart lida com byTag vazio", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildByTagChart>;

    given("um stats com byTag vazio", () => {});

    when("buildByTagChart é chamado", () => {
      chart = buildByTagChart(makeStats({ byTag: [] }));
    });

    then("o array de series deve ser vazio", () => {
      expect(chart.series).toEqual([]);
    });
  });

  test("buildBurndownChart retorna gráfico de linha com duas séries", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildBurndownChart>;

    given("um burndown com 3 pontos", () => {});

    when("buildBurndownChart é chamado", () => {
      chart = buildBurndownChart(makeBurndown());
    });

    then("o tipo deve ser \"line\" com séries \"Real\" e \"Ideal\"", () => {
      expect(chart.chart?.type).toBe("line");
      expect((chart.series as { name: string }[])[0].name).toBe("Real");
      expect((chart.series as { name: string }[])[1].name).toBe("Ideal");
    });
  });

  test("buildBurndownChart usa datas dos pontos como categorias", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildBurndownChart>;

    given("um burndown com datas \"2026-01-01\", \"2026-01-02\" e \"2026-01-03\"", () => {});

    when("buildBurndownChart é chamado", () => {
      chart = buildBurndownChart(makeBurndown());
    });

    then("as categorias do eixo x devem ser essas três datas", () => {
      expect(chart.xaxis?.categories).toEqual(["2026-01-01", "2026-01-02", "2026-01-03"]);
    });
  });

  test("buildBurndownChart dados de remaining correspondem aos pontos", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildBurndownChart>;

    given("um burndown com remaining 10, 8 e 5", () => {});

    when("buildBurndownChart é chamado", () => {
      chart = buildBurndownChart(makeBurndown());
    });

    then("a série Real deve ter os dados 10, 8 e 5", () => {
      const remaining = (chart.series as { data: number[] }[])[0].data;
      expect(remaining).toEqual([10, 8, 5]);
    });
  });

  test("buildBurndownChart dados de ideal correspondem aos pontos", ({ given, when, then }) => {
    let chart: ReturnType<typeof buildBurndownChart>;

    given("um burndown com ideal 10, 7 e 4", () => {});

    when("buildBurndownChart é chamado", () => {
      chart = buildBurndownChart(makeBurndown());
    });

    then("a série Ideal deve ter os dados 10, 7 e 4", () => {
      const ideal = (chart.series as { data: number[] }[])[1].data;
      expect(ideal).toEqual([10, 7, 4]);
    });
  });
});
