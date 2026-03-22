import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import {
  boardFilterSchema,
  BOARD_FILTER_DEFAULTS,
} from "@/common/schemas/boardFilterSchema";

const feature = loadFeature(path.join(__dirname, "boardFilterSchema.feature"));

defineFeature(feature, (test) => {
  test("Aceita estado padrão com filtros vazios", ({ given, when, then }) => {
    let input: typeof BOARD_FILTER_DEFAULTS;
    let result: ReturnType<typeof boardFilterSchema.safeParse>;

    given("os valores padrão do BOARD_FILTER_DEFAULTS", () => {
      input = { ...BOARD_FILTER_DEFAULTS };
    });

    when("o boardFilterSchema valida os dados", () => {
      result = boardFilterSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Aceita combinação válida de filtros", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof boardFilterSchema.safeParse>;

    given(
      /filtros com search "(.*)" tags "(.*)" users "(.*)" e datas "(.*)" a "(.*)"/,
      (search: string, tags: string, users: string, dateFrom: string, dateTo: string) => {
        input = {
          search,
          tags: tags.split(","),
          users: users.split(","),
          dateFrom,
          dateTo,
        };
      }
    );

    when("o boardFilterSchema valida os dados", () => {
      result = boardFilterSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Aceita arrays vazios para tags e users", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof boardFilterSchema.safeParse>;

    given("os valores padrão com tags e users como arrays vazios", () => {
      input = { ...BOARD_FILTER_DEFAULTS, tags: [], users: [] };
    });

    when("o boardFilterSchema valida os dados", () => {
      result = boardFilterSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Aceita datas em formato string", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof boardFilterSchema.safeParse>;

    given(
      /os valores padrão com dateFrom "(.*)" e dateTo "(.*)"/,
      (dateFrom: string, dateTo: string) => {
        input = { ...BOARD_FILTER_DEFAULTS, dateFrom, dateTo };
      }
    );

    when("o boardFilterSchema valida os dados", () => {
      result = boardFilterSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("BOARD_FILTER_DEFAULTS tem todos os campos com valores vazios", ({ given, when, then, and }) => {
    given("os valores padrão do BOARD_FILTER_DEFAULTS", () => {});

    when("os campos são verificados", () => {});

    then("search deve ser string vazia", () => {
      expect(BOARD_FILTER_DEFAULTS.search).toBe("");
    });

    and("tags e users devem ser arrays vazios", () => {
      expect(BOARD_FILTER_DEFAULTS.tags).toEqual([]);
      expect(BOARD_FILTER_DEFAULTS.users).toEqual([]);
    });

    and("dateFrom e dateTo devem ser strings vazias", () => {
      expect(BOARD_FILTER_DEFAULTS.dateFrom).toBe("");
      expect(BOARD_FILTER_DEFAULTS.dateTo).toBe("");
    });
  });
});
