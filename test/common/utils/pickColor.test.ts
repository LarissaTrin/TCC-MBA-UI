import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { pickColorByStatus } from "@/common/utils/pickColor";
import { Status } from "@/common/enum/status";
import { buildCard } from "../../mocks/factories";

const feature = loadFeature(path.join(__dirname, "pickColor.feature"));

defineFeature(feature, (test) => {
  test("Retorna laranja para status Pending", ({ given, when, then }) => {
    let card: ReturnType<typeof buildCard>;
    let color: string;

    given("um card com status Pending", () => {
      card = buildCard({ status: Status.Pending });
    });

    when("pickColorByStatus é chamado", () => {
      color = pickColorByStatus(card);
    });

    then(/a cor retornada deve ser "(.*)"/, (expected: string) => {
      expect(color).toBe(expected);
    });
  });

  test("Retorna azul para status InProgress", ({ given, when, then }) => {
    let card: ReturnType<typeof buildCard>;
    let color: string;

    given("um card com status InProgress", () => {
      card = buildCard({ status: Status.InProgress });
    });

    when("pickColorByStatus é chamado", () => {
      color = pickColorByStatus(card);
    });

    then(/a cor retornada deve ser "(.*)"/, (expected: string) => {
      expect(color).toBe(expected);
    });
  });

  test("Retorna amarelo para status Validation", ({ given, when, then }) => {
    let card: ReturnType<typeof buildCard>;
    let color: string;

    given("um card com status Validation", () => {
      card = buildCard({ status: Status.Validation });
    });

    when("pickColorByStatus é chamado", () => {
      color = pickColorByStatus(card);
    });

    then(/a cor retornada deve ser "(.*)"/, (expected: string) => {
      expect(color).toBe(expected);
    });
  });

  test("Retorna verde para status Done", ({ given, when, then }) => {
    let card: ReturnType<typeof buildCard>;
    let color: string;

    given("um card com status Done", () => {
      card = buildCard({ status: Status.Done });
    });

    when("pickColorByStatus é chamado", () => {
      color = pickColorByStatus(card);
    });

    then(/a cor retornada deve ser "(.*)"/, (expected: string) => {
      expect(color).toBe(expected);
    });
  });

  test("Retorna cinza para status desconhecido", ({ given, when, then }) => {
    let card: ReturnType<typeof buildCard>;
    let color: string;

    given("um card com status desconhecido", () => {
      card = buildCard({ status: "unknown" as Status });
    });

    when("pickColorByStatus é chamado", () => {
      color = pickColorByStatus(card);
    });

    then(/a cor retornada deve ser "(.*)"/, (expected: string) => {
      expect(color).toBe(expected);
    });
  });
});
