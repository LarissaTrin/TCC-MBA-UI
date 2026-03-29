import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import getSxProps from "@/common/utils/getSxProps";

const feature = loadFeature(path.join(__dirname, "getSxProps.feature"));

defineFeature(feature, (test) => {
  test("Retorna array vazio quando chamado sem argumento", ({ given, when, then }) => {
    let result: unknown;

    given("nenhum argumento é passado", () => {});

    when("getSxProps é chamado", () => {
      result = getSxProps();
    });

    then("o resultado deve ser um array vazio", () => {
      expect(result).toEqual([]);
    });
  });

  test("Retorna array vazio para undefined", ({ given, when, then }) => {
    let result: unknown;

    given("o argumento undefined é passado", () => {});

    when("getSxProps é chamado", () => {
      result = getSxProps(undefined);
    });

    then("o resultado deve ser um array vazio", () => {
      expect(result).toEqual([]);
    });
  });

  test("Envolve sxProps não-array em um array", ({ given, when, then }) => {
    let sx: object;
    let result: unknown;

    given("um objeto sxProps não-array com color \"red\"", () => {
      sx = { color: "red" };
    });

    when("getSxProps é chamado", () => {
      result = getSxProps(sx as any);
    });

    then("o resultado deve ser um array contendo o objeto", () => {
      expect(result).toEqual([sx]);
    });
  });

  test("Retorna sxProps array sem modificação", ({ given, when, then }) => {
    let sx: object[];
    let result: unknown;

    given("um array de sxProps com dois objetos", () => {
      sx = [{ color: "red" }, { margin: 1 }];
    });

    when("getSxProps é chamado", () => {
      result = getSxProps(sx as any);
    });

    then("o resultado deve ser a mesma referência do array original", () => {
      expect(result).toBe(sx);
    });
  });
});
