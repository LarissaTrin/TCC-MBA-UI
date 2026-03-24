import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenericTabs } from "@/components/widgets/Tabs";

const feature = loadFeature(path.join(__dirname, "Tabs.feature"));

const makeTabs = (labels: string[]) =>
  labels.map((label, i) => ({ label, value: i }));

defineFeature(feature, (test) => {
  test("Renderiza todos os tabs passados", ({ given, when, then }) => {
    given(/uma lista de tabs com labels "(.*)" e "(.*)"/, () => {});

    when("o componente é renderizado", () => {
      render(
        <GenericTabs
          selectedTab={0}
          tabsList={makeTabs(["Início", "Projetos"])}
          handleChange={jest.fn()}
        />
      );
    });

    then(/os textos "(.*)" e "(.*)" devem estar no documento/, (a: string, b: string) => {
      expect(screen.getByText(a)).toBeInTheDocument();
      expect(screen.getByText(b)).toBeInTheDocument();
    });
  });

  test("Chama handleChange ao clicar em um tab", ({ given, when, then }) => {
    const handleChange = jest.fn();

    given(/tabs com labels "(.*)" e "(.*)" e um handler handleChange/, () => {
      render(
        <GenericTabs
          selectedTab={0}
          tabsList={makeTabs(["A", "B"])}
          handleChange={handleChange}
        />
      );
    });

    when(/o tab "(.*)" é clicado/, (label: string) => {
      fireEvent.click(screen.getByText(label));
    });

    then("o handler handleChange deve ter sido chamado", () => {
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  test("Renderiza com orientação vertical", ({ given, when, then }) => {
    given("uma lista de tabs com orientação vertical", () => {});

    when("o componente é renderizado", () => {
      render(
        <GenericTabs
          selectedTab={0}
          tabsList={makeTabs(["Tab1"])}
          handleChange={jest.fn()}
          orientation="vertical"
        />
      );
    });

    then("o componente de tabs deve estar no documento", () => {
      expect(screen.getByRole("tablist")).toBeInTheDocument();
    });
  });

  test("Renderiza o tab selecionado corretamente", ({ given, when, then }) => {
    given(/tabs com selectedTab (\d+) e labels "(.*)" e "(.*)"/, () => {});

    when("o componente é renderizado", () => {
      render(
        <GenericTabs
          selectedTab={1}
          tabsList={makeTabs(["X", "Y"])}
          handleChange={jest.fn()}
        />
      );
    });

    then(/o tab "(.*)" deve ter atributo aria-selected true/, (label: string) => {
      expect(screen.getByRole("tab", { name: label })).toHaveAttribute("aria-selected", "true");
    });
  });
});
