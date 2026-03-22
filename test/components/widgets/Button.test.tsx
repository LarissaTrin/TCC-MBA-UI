import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenericButton } from "@/components/widgets/Button";
import { ButtonVariant } from "@/common/enum";

const feature = loadFeature(path.join(__dirname, "Button.feature"));

function renderButton(props: Parameters<typeof GenericButton>[0]) {
  return render(<GenericButton {...props} />);
}

defineFeature(feature, (test) => {
  test("Renderiza o label fornecido", ({ given, when, then }) => {
    let label: string;

    given(/um botão com label "(.*)"/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      renderButton({ label });
    });

    then(/deve existir um botão com o texto "(.*)"/, (text: string) => {
      expect(screen.getByRole("button", { name: new RegExp(text, "i") })).toBeInTheDocument();
    });
  });

  test("Chama onClick ao ser clicado", ({ given, when, then }) => {
    const handleClick = jest.fn();
    let label: string;

    given(/um botão com label "(.*)" e um handler onClick/, (lbl: string) => {
      label = lbl;
      renderButton({ label, onClick: handleClick });
    });

    when("o botão é clicado", () => {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(label, "i") }));
    });

    then("o handler onClick deve ter sido chamado uma vez", () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  test("Fica desabilitado quando disabled é true", ({ given, when, then }) => {
    let label: string;

    given(/um botão com label "(.*)" e disabled igual a true/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      renderButton({ label, disabled: true });
    });

    then("o botão deve estar desabilitado", () => {
      expect(screen.getByRole("button", { name: new RegExp(label, "i") })).toBeDisabled();
    });
  });

  test("Não chama onClick quando está desabilitado", ({ given, when, then }) => {
    const handleClick = jest.fn();
    let label: string;

    given(/um botão com label "(.*)" disabled e um handler onClick/, (lbl: string) => {
      label = lbl;
      renderButton({ label, disabled: true, onClick: handleClick });
    });

    when("o botão é clicado", () => {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(label, "i") }));
    });

    then("o handler onClick não deve ter sido chamado", () => {
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  test("Aplica variant text corretamente", ({ given, when, then }) => {
    let label: string;

    given(/um botão com label "(.*)" e variant text/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      renderButton({ label, variant: ButtonVariant.Text });
    });

    then("o botão deve estar presente no documento", () => {
      expect(screen.getByRole("button", { name: new RegExp(label, "i") })).toBeInTheDocument();
    });
  });

  test("Renderiza sem label no modo ícone", ({ given, when, then }) => {
    given(/um botão sem label e com ícone "(.*)"/, (_icon: string) => {});

    when("o componente é renderizado", () => {
      renderButton({ startIcon: "save" });
    });

    then("deve existir um botão no documento", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
