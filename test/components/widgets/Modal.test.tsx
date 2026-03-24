import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericModal } from "@/components/widgets/Modal";

const feature = loadFeature(path.join(__dirname, "Modal.feature"));

defineFeature(feature, (test) => {
  test("Exibe o conteúdo quando open é true", ({ given, when, then }) => {
    let content: string;

    given(/um modal aberto com conteúdo "(.*)"/, (text: string) => {
      content = text;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericModal open handleClose={jest.fn()}>
          <span>{content}</span>
        </GenericModal>
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Renderiza o título quando fornecido", ({ given, when, then }) => {
    let title: string;

    given(/um modal aberto com título "(.*)"/, (t: string) => {
      title = t;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericModal open title={title} handleClose={jest.fn()}>
          <span>conteúdo</span>
        </GenericModal>
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Não renderiza o conteúdo quando open é false", ({ given, when, then }) => {
    let content: string;

    given(/um modal fechado com conteúdo "(.*)"/, (text: string) => {
      content = text;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericModal open={false} handleClose={jest.fn()}>
          <span>{content}</span>
        </GenericModal>
      );
    });

    then(/o texto "(.*)" não deve estar no documento/, (text: string) => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  });

  test("Renderiza sem título quando title não é fornecido", ({ given, when, then }) => {
    given("um modal aberto sem título", () => {});

    when("o componente é renderizado", () => {
      render(
        <GenericModal open handleClose={jest.fn()}>
          <span>conteúdo</span>
        </GenericModal>
      );
    });

    then("nenhum heading deve estar no documento", () => {
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });
});
