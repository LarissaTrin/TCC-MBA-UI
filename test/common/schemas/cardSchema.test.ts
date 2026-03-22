import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { cardSchema } from "@/common/schemas/cardSchema";

const feature = loadFeature(path.join(__dirname, "cardSchema.feature"));

const validCard = {
  id: 1,
  name: "Implementar login",
  description: "Criar tela de login",
  sectionId: "1",
  status: "pending",
  priority: "2",
  storyPoints: "3",
  tasks: [],
  approvers: [],
  tags: [],
  blocked: false,
};

defineFeature(feature, (test) => {
  test("Valida card completo com sucesso", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com todos os campos válidos preenchidos", () => {
      input = { ...validCard };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Rejeita name vazio", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com name vazio", () => {
      input = { ...validCard, name: "" };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  test("Rejeita sectionId vazio", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com sectionId vazio", () => {
      input = { ...validCard, sectionId: "" };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  test("Rejeita id menor que 1", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com id igual a 0", () => {
      input = { ...validCard, id: 0 };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then(/a validação deve falhar com erro no campo "(.*)"/, (field: string) => {
      expect(result.success).toBe(false);
      if (!result.success)
        expect(result.error.issues[0].path[0]).toBe(field);
    });
  });

  test("Rejeita priority não numérica", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given(/um card com priority "(.*)"/, (priority: string) => {
      input = { ...validCard, priority };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve falhar", () => {
      expect(result.success).toBe(false);
    });
  });

  test("Aceita card sem campos opcionais", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card apenas com os campos obrigatórios", () => {
      input = {
        id: 1,
        name: "Card mínimo",
        sectionId: "1",
        tasks: [],
        approvers: [],
        tags: [],
        blocked: false,
      };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Valida sub-tarefa dentro de tasks", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com uma sub-tarefa válida em tasks", () => {
      input = {
        ...validCard,
        tasks: [{ id: 1, title: "Sub-tarefa", completed: false }],
      };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Valida tag dentro de tags", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given(/um card com uma tag com nome "(.*)"/, (name: string) => {
      input = { ...validCard, tags: [{ id: 1, name }] };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Rejeita tag com nome vazio", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com uma tag com nome vazio", () => {
      input = { ...validCard, tags: [{ id: 1, name: "" }] };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve falhar", () => {
      expect(result.success).toBe(false);
    });
  });

  test("Valida approver com ambiente preenchido", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given(/um card com um approver com ambiente "(.*)"/, (environment: string) => {
      input = { ...validCard, approvers: [{ id: 1, environment }] };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve ter sucesso", () => {
      expect(result.success).toBe(true);
    });
  });

  test("Rejeita approver com ambiente vazio", ({ given, when, then }) => {
    let input: object;
    let result: ReturnType<typeof cardSchema.safeParse>;

    given("um card com um approver com ambiente vazio", () => {
      input = { ...validCard, approvers: [{ id: 1, environment: "" }] };
    });

    when("o cardSchema valida os dados", () => {
      result = cardSchema.safeParse(input);
    });

    then("a validação deve falhar", () => {
      expect(result.success).toBe(false);
    });
  });
});
