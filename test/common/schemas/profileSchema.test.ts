import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { passwordSchema } from "@/common/schemas/profileSchema";

const feature = loadFeature(path.join(__dirname, "profileSchema.feature"));

defineFeature(feature, (test) => {
  test("Senhas iguais são aceitas", ({ given, when, then }) => {
    let result: ReturnType<typeof passwordSchema.safeParse>;

    given("um payload com password \"abc123\" e confirmPassword \"abc123\"", () => {});

    when("passwordSchema.safeParse é chamado", () => {
      result = passwordSchema.safeParse({ password: "abc123", confirmPassword: "abc123" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Senhas diferentes falham em confirmPassword", ({ given, when, then }) => {
    let result: ReturnType<typeof passwordSchema.safeParse>;

    given("um payload com password \"abc123\" e confirmPassword \"different\"", () => {});

    when("passwordSchema.safeParse é chamado", () => {
      result = passwordSchema.safeParse({ password: "abc123", confirmPassword: "different" });
    });

    then("o resultado deve ser falha com erro no campo confirmPassword", () => {
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("confirmPassword");
      }
    });
  });

  test("Strings vazias passam como campos opcionais", ({ given, when, then }) => {
    let result: ReturnType<typeof passwordSchema.safeParse>;

    given("um payload com password vazio e confirmPassword vazio", () => {});

    when("passwordSchema.safeParse é chamado", () => {
      result = passwordSchema.safeParse({ password: "", confirmPassword: "" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Senha com menos de 6 caracteres é rejeitada", ({ given, when, then }) => {
    let result: ReturnType<typeof passwordSchema.safeParse>;

    given("um payload com password \"abc\" e confirmPassword \"abc\"", () => {});

    when("passwordSchema.safeParse é chamado", () => {
      result = passwordSchema.safeParse({ password: "abc", confirmPassword: "abc" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("Payload vazio é aceito como campos opcionais", ({ given, when, then }) => {
    let result: ReturnType<typeof passwordSchema.safeParse>;

    given("um payload vazio", () => {});

    when("passwordSchema.safeParse é chamado", () => {
      result = passwordSchema.safeParse({});
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });
});
