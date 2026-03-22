import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { Status } from "@/common/enum/status";
import { buildCard, buildCardList } from "../../mocks/factories";

const feature = loadFeature(path.join(__dirname, "cardMapper.feature"));

defineFeature(feature, (test) => {
  test("Converte campos básicos id, title e subtitle", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com id 42, name \"Meu Card\" e status InProgress", () => {
      cards = [buildCard({ id: 42, name: "Meu Card", status: Status.InProgress })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter id 42, title \"Meu Card\" e subtitle InProgress", () => {
      expect(tasks[0].id).toBe(42);
      expect(tasks[0].title).toBe("Meu Card");
      expect(tasks[0].subtitle).toBe(Status.InProgress);
    });
  });

  test("Usa data de hoje como startDate quando não informada", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card sem startDate", () => {
      cards = [buildCard({ startDate: undefined })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter startDate igual à data de hoje", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(tasks[0].startDate).toBe(today);
    });
  });

  test("Usa data de hoje como endDate quando não informada", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card sem endDate", () => {
      cards = [buildCard({ endDate: undefined })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter endDate igual à data de hoje", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(tasks[0].endDate).toBe(today);
    });
  });

  test("Preserva startDate e endDate quando fornecidos", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given(/um card com startDate "(.*)" e endDate "(.*)"/, (startDate: string, endDate: string) => {
      cards = [buildCard({ startDate, endDate })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then(/a task deve ter startDate "(.*)" e endDate "(.*)"/, (startDate: string, endDate: string) => {
      expect(tasks[0].startDate).toBe(startDate);
      expect(tasks[0].endDate).toBe(endDate);
    });
  });

  test("Card bloqueado gera task com blocked true", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com blocked igual a true", () => {
      cards = [buildCard({ blocked: true })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter blocked igual a true", () => {
      expect(tasks[0].blocked).toBe(true);
    });
  });

  test("Card não bloqueado gera task com blocked false", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com blocked igual a false", () => {
      cards = [buildCard({ blocked: false })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter blocked igual a false", () => {
      expect(tasks[0].blocked).toBe(false);
    });
  });

  test("Card sem usuário gera userId e userDisplay undefined", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card sem usuário atribuído", () => {
      cards = [buildCard({ user: undefined })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter userId e userDisplay indefinidos", () => {
      expect(tasks[0].userId).toBeUndefined();
      expect(tasks[0].userDisplay).toBeUndefined();
    });
  });

  test("Card com usuário gera userDisplay com nome completo", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com usuário de firstName \"João\" e lastName \"Silva\"", () => {
      cards = [buildCard({
        user: { id: 1, firstName: "João", lastName: "Silva", email: "j@test.com" },
      })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter userDisplay \"João Silva\" e userId correto", () => {
      expect(tasks[0].userDisplay).toBe("João Silva");
      expect(tasks[0].userId).toBe(1);
    });
  });

  test("Conta sub-tarefas totais e completadas corretamente", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com 3 sub-tarefas sendo 2 completadas", () => {
      cards = [buildCard({
        tasks: [
          { id: 1, title: "T1", completed: true, date: null as any, user: null as any },
          { id: 2, title: "T2", completed: false, date: null as any, user: null as any },
          { id: 3, title: "T3", completed: true, date: null as any, user: null as any },
        ],
      })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter taskTotal 3 e taskCompleted 2", () => {
      expect(tasks[0].taskTotal).toBe(3);
      expect(tasks[0].taskCompleted).toBe(2);
    });
  });

  test("Card sem tasks tem contadores zerados", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card sem sub-tarefas", () => {
      cards = [buildCard({ tasks: [] })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter taskTotal 0 e taskCompleted 0", () => {
      expect(tasks[0].taskTotal).toBe(0);
      expect(tasks[0].taskCompleted).toBe(0);
    });
  });

  test("Card com tags preserva o array de tags", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("um card com 2 tags \"bug\" e \"feature\"", () => {
      cards = [buildCard({
        tags: [{ id: 1, name: "bug" }, { id: 2, name: "feature" }],
      })];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("a task deve ter 2 tags sendo a primeira \"bug\"", () => {
      expect(tasks[0].tags).toHaveLength(2);
      expect(tasks[0].tags[0].name).toBe("bug");
    });
  });

  test("Converte lista vazia sem erros", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCard>[];
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("uma lista vazia de cards", () => {
      cards = [];
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("o resultado deve ser um array vazio", () => {
      expect(tasks).toEqual([]);
    });
  });

  test("Converte múltiplos cards mantendo a ordem", ({ given, when, then }) => {
    let cards: ReturnType<typeof buildCardList>;
    let tasks: ReturnType<typeof mapCardsToTasks>;

    given("uma lista de 5 cards", () => {
      cards = buildCardList(5);
    });

    when("mapCardsToTasks é chamado", () => {
      tasks = mapCardsToTasks(cards);
    });

    then("o resultado deve ter 5 tasks na mesma ordem", () => {
      expect(tasks).toHaveLength(5);
      tasks.forEach((t, i) => expect(t.id).toBe(cards[i].id));
    });
  });
});
