import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenericTextField } from "@/components/widgets/TextField";

const feature = loadFeature(path.join(__dirname, "TextField.feature"));

defineFeature(feature, (test) => {
  test("Renderiza com o label correto", ({ given, when, then }) => {
    let label: string;

    given(/um TextField com label "(.*)"/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericTextField label={label} value="" onChange={jest.fn()} />);
    });

    then(/o label "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByLabelText(new RegExp(text, "i"))).toBeInTheDocument();
    });
  });

  test("Chama onChange ao digitar", ({ given, when, then }) => {
    const handleChange = jest.fn();

    given(/um TextField com label "(.*)" e um handler onChange/, (lbl: string) => {
      render(<GenericTextField label={lbl} value="" onChange={handleChange} />);
    });

    when(/o usuário digita "(.*)" no campo/, (text: string) => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
    });

    then("o handler onChange deve ter sido chamado", () => {
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  test("Exibe helperText quando fornecido", ({ given, when, then }) => {
    let helperText: string;

    given(/um TextField com helperText "(.*)"/, (text: string) => {
      helperText = text;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericTextField
          label="Campo"
          value=""
          onChange={jest.fn()}
          helperText={helperText}
        />
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Renderiza desabilitado quando disabled é true", ({ given, when, then }) => {
    let label: string;

    given(/um TextField com label "(.*)" e disabled true/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericTextField label={label} value="" onChange={jest.fn()} disabled />);
    });

    then("o input deve estar desabilitado", () => {
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });

  test("Renderiza em estado de erro quando error é true", ({ given, when, then }) => {
    let helperText: string;

    given(/um TextField com label "(.*)" e error true e helperText "(.*)"/, (_lbl: string, helper: string) => {
      helperText = helper;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericTextField
          label="Senha"
          value=""
          onChange={jest.fn()}
          error
          helperText={helperText}
        />
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
