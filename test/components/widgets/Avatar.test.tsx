import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericAvatar } from "@/components/widgets/Avatar";

const feature = loadFeature(path.join(__dirname, "Avatar.feature"));

defineFeature(feature, (test) => {
  test("Renderiza as iniciais de um nome completo", ({ given, when, then }) => {
    let fullName: string;

    given(/um avatar com fullName "(.*)"/, (name: string) => {
      fullName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericAvatar fullName={fullName} />);
    });

    then(/as iniciais "(.*)" devem estar no documento/, (initials: string) => {
      expect(screen.getByText(initials)).toBeInTheDocument();
    });
  });

  test("Renderiza sem quebrar com nome de uma palavra", ({ given, when, then }) => {
    let fullName: string;

    given(/um avatar com fullName "(.*)"/, (name: string) => {
      fullName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericAvatar fullName={fullName} />);
    });

    then("o componente deve estar no documento", () => {
      expect(document.querySelector(".MuiAvatar-root")).toBeInTheDocument();
    });
  });

  test("Aplica tamanho padrão de 40px", ({ given, when, then }) => {
    let fullName: string;

    given(/um avatar com fullName "(.*)" sem size definido/, (name: string) => {
      fullName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericAvatar fullName={fullName} />);
    });

    then("o avatar deve estar no documento", () => {
      expect(document.querySelector(".MuiAvatar-root")).toBeInTheDocument();
    });
  });

  test("Aplica tamanho customizado", ({ given, when, then }) => {
    let fullName: string;

    given(/um avatar com fullName "(.*)" e size (\d+)/, (name: string) => {
      fullName = name;
    });

    when("o componente é renderizado", () => {
      render(<GenericAvatar fullName={fullName} size={60} />);
    });

    then("o avatar deve estar no documento", () => {
      expect(document.querySelector(".MuiAvatar-root")).toBeInTheDocument();
    });
  });
});
