import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import {
  projectDetailsSchema,
  newListSchema,
  addUserSchema,
  newProjectSchema,
} from "@/common/schemas/projectSettingsSchema";

const feature = loadFeature(path.join(__dirname, "projectSettingsSchema.feature"));

defineFeature(feature, (test) => {
  test("projectDetailsSchema aceita nome válido", ({ given, when, then }) => {
    let result: ReturnType<typeof projectDetailsSchema.safeParse>;

    given("um payload com projectName \"My Project\"", () => {});

    when("projectDetailsSchema.safeParse é chamado", () => {
      result = projectDetailsSchema.safeParse({ projectName: "My Project" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("projectDetailsSchema rejeita nome menor que 3 caracteres", ({ given, when, then }) => {
    let result: ReturnType<typeof projectDetailsSchema.safeParse>;

    given("um payload com projectName \"AB\"", () => {});

    when("projectDetailsSchema.safeParse é chamado", () => {
      result = projectDetailsSchema.safeParse({ projectName: "AB" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("projectDetailsSchema aceita sem description", ({ given, when, then }) => {
    let result: ReturnType<typeof projectDetailsSchema.safeParse>;

    given("um payload com apenas projectName \"ABC\"", () => {});

    when("projectDetailsSchema.safeParse é chamado", () => {
      result = projectDetailsSchema.safeParse({ projectName: "ABC" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("projectDetailsSchema aceita com description", ({ given, when, then }) => {
    let result: ReturnType<typeof projectDetailsSchema.safeParse>;

    given("um payload com projectName \"ABC\" e description \"A desc\"", () => {});

    when("projectDetailsSchema.safeParse é chamado", () => {
      result = projectDetailsSchema.safeParse({ projectName: "ABC", description: "A desc" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("newListSchema aceita nome válido", ({ given, when, then }) => {
    let result: ReturnType<typeof newListSchema.safeParse>;

    given("um payload com name \"To Do\"", () => {});

    when("newListSchema.safeParse é chamado", () => {
      result = newListSchema.safeParse({ name: "To Do" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("newListSchema rejeita nome vazio", ({ given, when, then }) => {
    let result: ReturnType<typeof newListSchema.safeParse>;

    given("um payload com name vazio", () => {});

    when("newListSchema.safeParse é chamado", () => {
      result = newListSchema.safeParse({ name: "" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("addUserSchema aceita email válido", ({ given, when, then }) => {
    let result: ReturnType<typeof addUserSchema.safeParse>;

    given("um payload com email \"user@example.com\"", () => {});

    when("addUserSchema.safeParse é chamado", () => {
      result = addUserSchema.safeParse({ email: "user@example.com" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("addUserSchema rejeita email inválido", ({ given, when, then }) => {
    let result: ReturnType<typeof addUserSchema.safeParse>;

    given("um payload com email \"not-an-email\"", () => {});

    when("addUserSchema.safeParse é chamado", () => {
      result = addUserSchema.safeParse({ email: "not-an-email" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("addUserSchema rejeita email vazio", ({ given, when, then }) => {
    let result: ReturnType<typeof addUserSchema.safeParse>;

    given("um payload com email vazio", () => {});

    when("addUserSchema.safeParse é chamado", () => {
      result = addUserSchema.safeParse({ email: "" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });

  test("newProjectSchema aceita nome válido", ({ given, when, then }) => {
    let result: ReturnType<typeof newProjectSchema.safeParse>;

    given("um payload com projectName \"New Project\"", () => {});

    when("newProjectSchema.safeParse é chamado", () => {
      result = newProjectSchema.safeParse({ projectName: "New Project" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("newProjectSchema aceita nome com exatamente 3 caracteres", ({ given, when, then }) => {
    let result: ReturnType<typeof newProjectSchema.safeParse>;

    given("um payload com projectName de exatamente 3 caracteres \"ABC\"", () => {});

    when("newProjectSchema.safeParse é chamado", () => {
      result = newProjectSchema.safeParse({ projectName: "ABC" });
    });

    then("o resultado deve ser sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("newProjectSchema rejeita nome com 2 caracteres", ({ given, when, then }) => {
    let result: ReturnType<typeof newProjectSchema.safeParse>;

    given("um payload com projectName \"AB\"", () => {});

    when("newProjectSchema.safeParse é chamado", () => {
      result = newProjectSchema.safeParse({ projectName: "AB" });
    });

    then("o resultado deve ser falha", () => {
      expect(result.success).toBe(false);
    });
  });
});
