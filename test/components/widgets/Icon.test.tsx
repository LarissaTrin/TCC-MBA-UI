import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenericIcon } from "@/components/widgets/Icon";

const feature = loadFeature(path.join(__dirname, "Icon.feature"));

defineFeature(feature, (test) => {
  test("Renderiza o nome do ícone como conteúdo", ({ given, when, then }) => {
    let iconName: string;

    given(/um ícone com nome "(.*)"/, (name: string) => {
      iconName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericIcon icon={iconName as never} />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Chama onClick ao ser clicado", ({ given, when, then }) => {
    const handleClick = jest.fn();
    let iconName: string;

    given(/um ícone com nome "(.*)" e um handler onClick/, (name: string) => {
      iconName = name;
      render(<GenericIcon icon={iconName as never} onClick={handleClick} />);
    });

    when("o ícone é clicado", () => {
      fireEvent.click(screen.getByText(iconName));
    });

    then("o handler onClick deve ter sido chamado uma vez", () => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  test("Não chama onClick quando onClick não é passado", ({ given, when, then }) => {
    let iconName: string;

    given(/um ícone com nome "(.*)" sem onClick/, (name: string) => {
      iconName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericIcon icon={iconName as never} />);
    });

    then("o ícone deve estar no documento sem lançar erros", () => {
      expect(screen.getByText(iconName)).toBeInTheDocument();
    });
  });

  test("Renderiza com tamanho numérico customizado", ({ given, when, then }) => {
    let iconName: string;

    given(/um ícone com nome "(.*)" e size (\d+)/, (name: string) => {
      iconName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericIcon icon={iconName as never} size={32} />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
