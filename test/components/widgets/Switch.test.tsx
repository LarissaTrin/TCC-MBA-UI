import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericSwitch } from "@/components/widgets/Switch";

const feature = loadFeature(path.join(__dirname, "Switch.feature"));

defineFeature(feature, (test) => {
  test("Renderiza o label correto", ({ given, when, then }) => {
    let label: string;

    given(/um switch com label "(.*)"/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericSwitch label={label} />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Renderiza desabilitado quando disabled é true", ({ given, when, then }) => {
    let label: string;

    given(/um switch com label "(.*)" e disabled true/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericSwitch label={label} disabled />);
    });

    then("o switch deve estar desabilitado", () => {
      expect(screen.getByRole("switch")).toBeDisabled();
    });
  });

  test("Renderiza marcado por padrão com defaultChecked", ({ given, when, then }) => {
    let label: string;

    given(/um switch com label "(.*)" e defaultChecked true/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericSwitch label={label} defaultChecked />);
    });

    then("o switch deve estar marcado", () => {
      expect(screen.getByRole("switch")).toBeChecked();
    });
  });

  test("Renderiza desmarcado por padrão sem defaultChecked", ({ given, when, then }) => {
    let label: string;

    given(/um switch com label "(.*)" sem defaultChecked/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericSwitch label={label} />);
    });

    then("o switch deve estar desmarcado", () => {
      expect(screen.getByRole("switch")).not.toBeChecked();
    });
  });
});
