import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import {
  loginSchema,
  registerSchema,
  forgotSchema,
  changePasswordSchema,
} from "@/common/schemas/authSchema";

const feature = loadFeature(path.join(__dirname, "authSchema.feature"));

const validRegister = {
  firstName: "João",
  lastName: "Silva",
  username: "joaosilva",
  email: "joao@test.com",
  password: "senha123",
  confirmPassword: "senha123",
  terms: true,
};

defineFeature(feature, (test) => {
  // ─── loginSchema ────────────────────────────────────────────────────────────

  test("Login aceita email e senha válidos", ({ given, when, then }) => {
    let input: { email: string; password: string };
    let result: ReturnType<typeof loginSchema.safeParse>;

    given(/dados de login com email "(.*)" e senha "(.*)"/, (email: string, password: string) => {
      input = { email, password };
    });

    when("o loginSchema valida os dados", () => {
      result = loginSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Login rejeita email malformado", ({ given, when, then }) => {
    let input: { email: string; password: string };
    let result: ReturnType<typeof loginSchema.safeParse>;

    given(/dados de login com email "(.*)" e senha "(.*)"/, (email: string, password: string) => {
      input = { email, password };
    });

    when("o loginSchema valida os dados", () => {
      result = loginSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  test("Login rejeita senha com menos de 6 caracteres", ({ given, when, then }) => {
    let input: { email: string; password: string };
    let result: ReturnType<typeof loginSchema.safeParse>;

    given(/dados de login com email "(.*)" e senha "(.*)"/, (email: string, password: string) => {
      input = { email, password };
    });

    when("o loginSchema valida os dados", () => {
      result = loginSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  // ─── registerSchema ─────────────────────────────────────────────────────────

  test("Registro aceita dados válidos", ({ given, when, then }) => {
    let input: typeof validRegister;
    let result: ReturnType<typeof registerSchema.safeParse>;

    given("dados de registro válidos", () => {
      input = { ...validRegister };
    });

    when("o registerSchema valida os dados", () => {
      result = registerSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Registro rejeita senhas que não coincidem", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof registerSchema.safeParse>;

    given("dados de registro com confirmPassword divergente", () => {
      input = { ...validRegister, confirmPassword: "diferente" };
    });

    when("o registerSchema valida os dados", () => {
      result = registerSchema.safeParse(input);
    });

    then("a validação deve falhar com erro de confirmPassword", () => {
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((e) => e.path[0] === "confirmPassword");
        expect(err?.message).toMatch(/coincidem/i);
      }
    });
  });

  test("Registro rejeita terms igual a false", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof registerSchema.safeParse>;

    given("dados de registro com terms igual a false", () => {
      input = { ...validRegister, terms: false };
    });

    when("o registerSchema valida os dados", () => {
      result = registerSchema.safeParse(input);
    });

    then("a validação deve falhar no campo terms", () => {
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((e) => e.path[0] === "terms");
        expect(err).toBeDefined();
      }
    });
  });

  test("Registro rejeita username com menos de 3 caracteres", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof registerSchema.safeParse>;

    given("dados de registro com username curto", () => {
      input = { ...validRegister, username: "ab" };
    });

    when("o registerSchema valida os dados", () => {
      result = registerSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  test("Registro rejeita firstName vazio", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof registerSchema.safeParse>;

    given("dados de registro com firstName vazio", () => {
      input = { ...validRegister, firstName: "" };
    });

    when("o registerSchema valida os dados", () => {
      result = registerSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  // ─── forgotSchema ───────────────────────────────────────────────────────────

  test("Recuperação de senha aceita email válido", ({ given, when, then }) => {
    let input: { email: string };
    let result: ReturnType<typeof forgotSchema.safeParse>;

    given(/email "(.*)" para recuperação de senha/, (email: string) => {
      input = { email };
    });

    when("o forgotSchema valida os dados", () => {
      result = forgotSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Recuperação de senha rejeita email malformado", ({ given, when, then }) => {
    let input: { email: string };
    let result: ReturnType<typeof forgotSchema.safeParse>;

    given(/email "(.*)" para recuperação de senha/, (email: string) => {
      input = { email };
    });

    when("o forgotSchema valida os dados", () => {
      result = forgotSchema.safeParse(input);
    });

    then("a validação deve falhar", () => {
      expect(result.success).toBe(false);
    });
  });

  // ─── changePasswordSchema ───────────────────────────────────────────────────

  test("Alteração de senha aceita senhas que coincidem", ({ given, when, then }) => {
    let input: { password: string; confirmPassword: string };
    let result: ReturnType<typeof changePasswordSchema.safeParse>;

    given(/nova senha "(.*)" e confirmação "(.*)"/, (password: string, confirmPassword: string) => {
      input = { password, confirmPassword };
    });

    when("o changePasswordSchema valida os dados", () => {
      result = changePasswordSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Alteração de senha rejeita senhas que não coincidem", ({ given, when, then }) => {
    let input: { password: string; confirmPassword: string };
    let result: ReturnType<typeof changePasswordSchema.safeParse>;

    given(/nova senha "(.*)" e confirmação "(.*)"/, (password: string, confirmPassword: string) => {
      input = { password, confirmPassword };
    });

    when("o changePasswordSchema valida os dados", () => {
      result = changePasswordSchema.safeParse(input);
    });

    then("a validação deve falhar com erro de confirmPassword", () => {
      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((e) => e.path[0] === "confirmPassword");
        expect(err?.message).toMatch(/coincidem/i);
      }
    });
  });

  test("Alteração de senha rejeita senha com menos de 6 caracteres", ({ given, when, then }) => {
    let input: { password: string; confirmPassword: string };
    let result: ReturnType<typeof changePasswordSchema.safeParse>;

    given(/nova senha "(.*)" e confirmação "(.*)"/, (password: string, confirmPassword: string) => {
      input = { password, confirmPassword };
    });

    when("o changePasswordSchema valida os dados", () => {
      result = changePasswordSchema.safeParse(input);
    });

    then("a validação deve falhar", () => {
      expect(result.success).toBe(false);
    });
  });
});
