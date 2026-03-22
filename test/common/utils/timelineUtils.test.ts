import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import {
  getDaysDiff,
  addDays,
  formatDate,
  generateTimelineMonths,
} from "@/common/utils/timelineUtils";

const feature = loadFeature(path.join(__dirname, "timelineUtils.feature"));

defineFeature(feature, (test) => {
  // ─── getDaysDiff ────────────────────────────────────────────────────────────

  test("getDaysDiff retorna 0 para datas iguais", ({ given, when, then }) => {
    let start: Date;
    let result: number;

    given("duas datas iguais", () => {
      start = new Date("2026-03-01");
    });

    when("getDaysDiff é chamado", () => {
      result = getDaysDiff(start, start);
    });

    then("o resultado deve ser 0", () => {
      expect(result).toBe(0);
    });
  });

  test("getDaysDiff retorna positivo quando end é maior que start", ({ given, when, then }) => {
    let startDate: Date;
    let endDate: Date;
    let result: number;

    given(/start "(.*)" e end "(.*)"/, (s: string, e: string) => {
      startDate = new Date(s);
      endDate = new Date(e);
    });

    when("getDaysDiff é chamado", () => {
      result = getDaysDiff(startDate, endDate);
    });

    then(/o resultado deve ser (\d+)/, (expected: string) => {
      expect(result).toBe(Number(expected));
    });
  });

  test("getDaysDiff retorna negativo quando end é menor que start", ({ given, when, then }) => {
    let startDate: Date;
    let endDate: Date;
    let result: number;

    given(/start "(.*)" e end "(.*)"/, (s: string, e: string) => {
      startDate = new Date(s);
      endDate = new Date(e);
    });

    when("getDaysDiff é chamado", () => {
      result = getDaysDiff(startDate, endDate);
    });

    then(/o resultado deve ser (-\d+)/, (expected: string) => {
      expect(result).toBe(Number(expected));
    });
  });

  // ─── addDays ────────────────────────────────────────────────────────────────

  test("addDays adiciona o número correto de dias", ({ given, when, then }) => {
    let base: Date;
    let result: Date;

    given("a data local 1 de março de 2026", () => {
      base = new Date(2026, 2, 1);
    });

    when("addDays é chamado com 5 dias", () => {
      result = addDays(base, 5);
    });

    then("a data resultante deve ter dia 6", () => {
      expect(result.getDate()).toBe(6);
    });
  });

  test("addDays não muta a data original", ({ given, when, then }) => {
    let base: Date;

    given("a data local 15 de março de 2026", () => {
      base = new Date(2026, 2, 15);
    });

    when("addDays é chamado com 5 dias", () => {
      addDays(base, 5);
    });

    then("a data original ainda deve ter dia 15", () => {
      expect(base.getDate()).toBe(15);
    });
  });

  test("addDays lida com crossing de mês", ({ given, when, then }) => {
    let base: Date;
    let result: Date;

    given("a data local 30 de janeiro de 2026", () => {
      base = new Date(2026, 0, 30);
    });

    when("addDays é chamado com 3 dias", () => {
      result = addDays(base, 3);
    });

    then("a data resultante deve estar no mês de fevereiro", () => {
      expect(result.getMonth()).toBe(1);
    });
  });

  // ─── formatDate ─────────────────────────────────────────────────────────────

  test("formatDate retorna string no padrão YYYY-MM-DD", ({ given, when, then }) => {
    let date: Date;
    let result: string;

    given(/a data "(.*)"/, (dateStr: string) => {
      date = new Date(dateStr);
    });

    when("formatDate é chamado", () => {
      result = formatDate(date);
    });

    then("o resultado deve seguir o padrão YYYY-MM-DD", () => {
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  // ─── generateTimelineMonths ─────────────────────────────────────────────────

  test("generateTimelineMonths retorna a quantidade correta de meses", ({ given, when, then }) => {
    let ref: Date;
    let result: ReturnType<typeof generateTimelineMonths>;

    given("uma data de referência com 1 mês antes e 4 meses depois", () => {
      ref = new Date("2026-03-01");
    });

    when("generateTimelineMonths é chamado", () => {
      result = generateTimelineMonths(ref, 1, 4);
    });

    then("o resultado deve ter 6 meses", () => {
      expect(result).toHaveLength(6);
    });
  });

  test("generateTimelineMonths retorna os dias corretos por mês", ({ given, when, then }) => {
    let ref: Date;
    let result: ReturnType<typeof generateTimelineMonths>;

    given("fevereiro de 2026 como mês de referência sem meses adjacentes", () => {
      ref = new Date(2026, 1, 15);
    });

    when("generateTimelineMonths é chamado", () => {
      result = generateTimelineMonths(ref, 0, 0);
    });

    then("o mês retornado deve ter 28 dias", () => {
      expect(result).toHaveLength(1);
      expect(result[0].days).toHaveLength(28);
    });
  });

  test("generateTimelineMonths calcula o primeiro mês corretamente", ({ given, when, then }) => {
    let ref: Date;
    let result: ReturnType<typeof generateTimelineMonths>;

    given("março de 2026 como referência com 2 meses antes", () => {
      ref = new Date(2026, 2, 15);
    });

    when("generateTimelineMonths é chamado", () => {
      result = generateTimelineMonths(ref, 2, 0);
    });

    then("o primeiro mês deve ser janeiro de 2026", () => {
      expect(result[0].month).toBe(0);
      expect(result[0].year).toBe(2026);
    });
  });

  test("generateTimelineMonths retorna meses com campos year month e days", ({ given, when, then }) => {
    let ref: Date;
    let result: ReturnType<typeof generateTimelineMonths>;

    given("uma data de referência sem meses adjacentes", () => {
      ref = new Date("2026-03-01");
    });

    when("generateTimelineMonths é chamado", () => {
      result = generateTimelineMonths(ref, 0, 0);
    });

    then("cada mês deve ter os campos year, month e days", () => {
      const [first] = result;
      expect(first).toHaveProperty("year");
      expect(first).toHaveProperty("month");
      expect(first).toHaveProperty("days");
      expect(Array.isArray(first.days)).toBe(true);
    });
  });
});
