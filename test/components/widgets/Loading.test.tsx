import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericLoading } from "@/components/widgets/Loading";

const feature = loadFeature(path.join(__dirname, "Loading.feature"));

defineFeature(feature, (test) => {
  test("Renderiza o spinner padrão", ({ given, when, then }) => {
    given("o componente GenericLoading sem props", () => {});

    when("o componente é renderizado", () => {
      render(<GenericLoading />);
    });

    then("deve existir um indicador de progresso no documento", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  test("Renderiza o spinner com fullPage", ({ given, when, then }) => {
    given("o componente GenericLoading com fullPage true", () => {});

    when("o componente é renderizado", () => {
      render(<GenericLoading fullPage />);
    });

    then("deve existir um indicador de progresso no documento", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  test("Renderiza sem wrapper quando fullPage é false", ({ given, when, then }) => {
    given("o componente GenericLoading com fullPage false", () => {});

    when("o componente é renderizado", () => {
      render(<GenericLoading fullPage={false} />);
    });

    then("deve existir um indicador de progresso no documento", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
