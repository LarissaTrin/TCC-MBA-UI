import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { registerSchema } from "@/common/schemas/authSchema";

const feature = loadFeature(path.join(__dirname, "register.feature"));

const validRegisterData = {
  firstName: "João",
  lastName: "Silva",
  username: "joaosilva",
  email: "joao@test.com",
  password: "senha123",
  confirmPassword: "senha123",
  terms: true,
};

defineFeature(feature, (test) => {
  test("Registro com senhas divergentes", ({ given, when, and, then }) => {
    let parseResult: ReturnType<typeof registerSchema.safeParse>;

    given("o usuário está na página de registro", () => {});

    when(
      /ele preenche os dados de registro com senha "(.*)" e confirmação "(.*)"/,
      (password: string, confirmPassword: string) => {
        parseResult = registerSchema.safeParse({
          ...validRegisterData,
          password,
          confirmPassword,
        });
      }
    );

    and("clica em registrar", () => {});

    then(
      "uma mensagem de erro de confirmação de senha é exibida",
      () => {
        expect(parseResult.success).toBe(false);
        if (!parseResult.success) {
          const confirmError = parseResult.error.issues.find(
            (e) => e.path[0] === "confirmPassword"
          );
          expect(confirmError).toBeDefined();
          expect(confirmError?.message).toMatch(/coincidem/i);
        }
      }
    );
  });

  test("Registro sem aceitar os termos", ({ given, when, and, then }) => {
    let parseResult: ReturnType<typeof registerSchema.safeParse>;

    given("o usuário está na página de registro", () => {});

    when(
      "ele preenche os dados de registro válidos mas não aceita os termos",
      () => {
        parseResult = registerSchema.safeParse({
          ...validRegisterData,
          terms: false,
        });
      }
    );

    and("clica em registrar", () => {});

    then("uma mensagem de erro de termos é exibida", () => {
      expect(parseResult.success).toBe(false);
      if (!parseResult.success) {
        const termsError = parseResult.error.issues.find(
          (e) => e.path[0] === "terms"
        );
        expect(termsError).toBeDefined();
      }
    });
  });

  test(
    "Registro com todos os campos válidos",
    ({ given, when, then }) => {
      let parseResult: ReturnType<typeof registerSchema.safeParse>;

      given("o usuário está na página de registro", () => {});

      when(
        "ele preenche todos os campos corretamente incluindo aceitar os termos",
        () => {
          parseResult = registerSchema.safeParse(validRegisterData);
        }
      );

      then(
        "o formulário é considerado válido pelo schema Zod",
        () => {
          expect(parseResult.success).toBe(true);
        }
      );
    }
  );
});
