import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen } from "@testing-library/react";
import { GenericBadge } from "@/components/widgets/Badge";

const feature = loadFeature(path.join(__dirname, "Badge.feature"));

defineFeature(feature, (test) => {
  test("Renderiza os children passados", ({ given, when, then }) => {
    given(/um badge com children "(.*)"/, () => {});

    when("o componente é renderizado", () => {
      render(<GenericBadge count={0}><span>ícone</span></GenericBadge>);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Exibe a contagem correta no badge", ({ given, when, then }) => {
    given(/um badge com count (\d+)/, () => {});

    when("o componente é renderizado", () => {
      render(<GenericBadge count={7}><span>icon</span></GenericBadge>);
    });

    then(/o número (\d+) deve estar no documento/, () => {
      expect(screen.getByText("7")).toBeInTheDocument();
    });
  });

  test("Renderiza variante dot sem exibir contagem", ({ given, when, then }) => {
    given(/um badge com count (\d+) e variante dot/, () => {});

    when("o componente é renderizado", () => {
      render(<GenericBadge count={3} variant="dot"><span>icon</span></GenericBadge>);
    });

    then("o badge deve estar no documento", () => {
      expect(document.querySelector(".MuiBadge-root")).toBeInTheDocument();
    });
  });

  test("Renderiza com contagem zero por padrão", ({ given, when, then }) => {
    given("um badge sem count definido", () => {});

    when("o componente é renderizado", () => {
      render(<GenericBadge><span>icon</span></GenericBadge>);
    });

    then("o badge deve estar no documento", () => {
      expect(document.querySelector(".MuiBadge-root")).toBeInTheDocument();
    });
  });
});
