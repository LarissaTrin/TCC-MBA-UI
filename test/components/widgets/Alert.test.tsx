import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericAlert } from "@/components/widgets/Alert";
import { SeverityColor } from "@/common/enum";

const feature = loadFeature(path.join(__dirname, "Alert.feature"));

defineFeature(feature, (test) => {
  test("Exibe o conteúdo quando open é true", ({ given, when, then }) => {
    let content: string;

    given(/um alert com conteúdo "(.*)" e open true/, (text: string) => {
      content = text;
    });

    when("o componente é renderizado", () => {
      render(<GenericAlert open content={content} handleClose={jest.fn()} />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Renderiza o alert com severidade success por padrão", ({ given, when, then }) => {
    given("um alert aberto sem severidade definida", () => {});

    when("o componente é renderizado", () => {
      render(<GenericAlert open content="OK" handleClose={jest.fn()} />);
    });

    then("deve existir um elemento com role alert no documento", () => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  test("Renderiza o alert com severidade error", ({ given, when, then }) => {
    let content: string;

    given(/um alert aberto com severidade error e conteúdo "(.*)"/, (text: string) => {
      content = text;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericAlert
          open
          content={content}
          severity={SeverityColor.Error}
          handleClose={jest.fn()}
        />
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Renderiza o alert com severidade warning", ({ given, when, then }) => {
    let content: string;

    given(/um alert aberto com severidade warning e conteúdo "(.*)"/, (text: string) => {
      content = text;
    });

    when("o componente é renderizado", () => {
      render(
        <GenericAlert
          open
          content={content}
          severity={SeverityColor.Warning}
          handleClose={jest.fn()}
        />
      );
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
