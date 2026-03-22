import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { buildCard } from "../../mocks/factories";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { cardSchema } from "@/common/schemas/cardSchema";
import type { Task } from "@/common/model";

const feature = loadFeature(path.join(__dirname, "card-crud.feature"));

defineFeature(feature, (test) => {
  test("Card bloqueado exibe flag blocked", ({ given, when, then }) => {
    let task: Task;

    given("existe um card com blocked igual a true", () => {
      const card = buildCard({ blocked: true });
      task = mapCardsToTasks([card])[0];
    });

    when("o card é mapeado para Task", () => {
      // mapping already happened in Given
    });

    then("a task resultante tem blocked igual a true", () => {
      expect(task.blocked).toBe(true);
    });
  });

  test("Card sem usuário não quebra o mapeamento", ({ given, when, then, and }) => {
    let task: Task;

    given("existe um card sem usuário atribuído", () => {
      const card = buildCard({ user: undefined });
      task = mapCardsToTasks([card])[0];
    });

    when("o card é mapeado para Task", () => {});

    then("a task resultante tem userId undefined", () => {
      expect(task.userId).toBeUndefined();
    });

    and("a task resultante tem userDisplay undefined", () => {
      expect(task.userDisplay).toBeUndefined();
    });
  });

  test(
    "Card com sub-tarefas conta corretamente as completas",
    ({ given, when, then, and }) => {
      let task: Task;

      given("existe um card com 3 sub-tarefas sendo 2 completas", () => {
        const card = buildCard({
          tasks: [
            { id: 1, title: "T1", completed: true, date: null as any, user: null as any },
            { id: 2, title: "T2", completed: true, date: null as any, user: null as any },
            { id: 3, title: "T3", completed: false, date: null as any, user: null as any },
          ],
        });
        task = mapCardsToTasks([card])[0];
      });

      when("o card é mapeado para Task", () => {});

      then("a task tem taskTotal igual a 3", () => {
        expect(task.taskTotal).toBe(3);
      });

      and("a task tem taskCompleted igual a 2", () => {
        expect(task.taskCompleted).toBe(2);
      });
    }
  );

  test(
    "Validação do schema de card com campos obrigatórios ausentes",
    ({ given, when, then }) => {
      let parseResult: ReturnType<typeof cardSchema.safeParse>;

      given("um objeto de card sem nome", () => {});

      when("o schema de card faz a validação", () => {
        parseResult = cardSchema.safeParse({
          id: 1,
          name: "",
          sectionId: "1",
          tasks: [],
          approvers: [],
          tags: [],
          blocked: false,
        });
      });

      then("a validação falha com erro no campo name", () => {
        expect(parseResult.success).toBe(false);
        if (!parseResult.success) {
          const nameError = parseResult.error.issues.find(
            (e) => e.path[0] === "name"
          );
          expect(nameError).toBeDefined();
        }
      });
    }
  );
});
