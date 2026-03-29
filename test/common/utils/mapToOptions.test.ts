import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { mapToOptions } from "@/common/utils/mapToOptions";

const feature = loadFeature(path.join(__dirname, "mapToOptions.feature"));

defineFeature(feature, (test) => {
  test("Mapeia itens para array AutocompleteOption", ({ given, when, then }) => {
    let items: { id: string; name: string }[];
    let options: ReturnType<typeof mapToOptions>;

    given("uma lista com itens de id \"1\" nome \"Frontend\" e id \"2\" nome \"Backend\"", () => {
      items = [
        { id: "1", name: "Frontend" },
        { id: "2", name: "Backend" },
      ];
    });

    when("mapToOptions é chamado", () => {
      options = mapToOptions(items);
    });

    then("o resultado deve conter value \"1\" label \"Frontend\" e value \"2\" label \"Backend\"", () => {
      expect(options).toEqual([
        { value: "1", label: "Frontend" },
        { value: "2", label: "Backend" },
      ]);
    });
  });

  test("Retorna array vazio para entrada vazia", ({ given, when, then }) => {
    let options: ReturnType<typeof mapToOptions>;

    given("uma lista vazia", () => {});

    when("mapToOptions é chamado", () => {
      options = mapToOptions([]);
    });

    then("o resultado deve ser um array vazio", () => {
      expect(options).toEqual([]);
    });
  });

  test("Item único é mapeado corretamente", ({ given, when, then }) => {
    let options: ReturnType<typeof mapToOptions>;

    given("uma lista com item de id \"abc\" e nome \"Tag\"", () => {});

    when("mapToOptions é chamado", () => {
      options = mapToOptions([{ id: "abc", name: "Tag" }]);
    });

    then("o resultado deve ter 1 item com value \"abc\" e label \"Tag\"", () => {
      expect(options).toHaveLength(1);
      expect(options[0].value).toBe("abc");
      expect(options[0].label).toBe("Tag");
    });
  });

  test("Preserva a ordem dos itens", ({ given, when, then }) => {
    let items: { id: string; name: string }[];
    let options: ReturnType<typeof mapToOptions>;

    given("uma lista com itens na ordem C, A, B com ids 3, 1, 2", () => {
      items = [
        { id: "3", name: "C" },
        { id: "1", name: "A" },
        { id: "2", name: "B" },
      ];
    });

    when("mapToOptions é chamado", () => {
      options = mapToOptions(items);
    });

    then("os values do resultado devem estar na ordem \"3\", \"1\", \"2\"", () => {
      expect(options.map((o) => o.value)).toEqual(["3", "1", "2"]);
    });
  });
});
