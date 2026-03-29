import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { newCardSchema } from "@/common/schemas/newCardSchema";

const feature = loadFeature(path.join(__dirname, "newCardSchema.feature"));

defineFeature(feature, (test) => {
  test("Título válido é aceito", ({ given, when, then }) => {
    let result: ReturnType<typeof newCardSchema.safeParse>;

    given("um payload com title \"My Card\"", () => {});

    when("newCardSchema.safeParse é chamado", () => {
      result = newCardSchema.safeParse({ title: "My Card" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Título vazio é rejeitado", ({ given, when, then }) => {
    let result: ReturnType<typeof newCardSchema.safeParse>;

    given("um payload com title vazio", () => {});

    when("newCardSchema.safeParse é chamado", () => {
      result = newCardSchema.safeParse({ title: "" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("Título ausente é rejeitado", ({ given, when, then }) => {
    let result: ReturnType<typeof newCardSchema.safeParse>;

    given("um payload sem o campo title", () => {});

    when("newCardSchema.safeParse é chamado", () => {
      result = newCardSchema.safeParse({});
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("Título com um único caractere é aceito", ({ given, when, then }) => {
    let result: ReturnType<typeof newCardSchema.safeParse>;

    given("um payload com title de um único caractere \"A\"", () => {});

    when("newCardSchema.safeParse é chamado", () => {
      result = newCardSchema.safeParse({ title: "A" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });
});
