import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenericChip } from "@/components/widgets/Chip";

const feature = loadFeature(path.join(__dirname, "Chip.feature"));

defineFeature(feature, (test) => {
  test("Renderiza o label correto", ({ given, when, then }) => {
    let label: string;

    given(/um chip com label "(.*)"/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericChip label={label} />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test("Chama onDelete ao clicar no ícone de exclusão", ({ given, when, then }) => {
    const handleDelete = jest.fn();

    given(/um chip com label "(.*)" e um handler onDelete/, (lbl: string) => {
      render(<GenericChip label={lbl} onDelete={handleDelete} />);
    });

    when("o ícone de exclusão é clicado", () => {
      const deleteIcon = document.querySelector(".MuiChip-deleteIcon") as HTMLElement;
      fireEvent.click(deleteIcon);
    });

    then("o handler onDelete deve ter sido chamado uma vez", () => {
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });

  test("Não exibe ícone de exclusão quando onDelete não é passado", ({ given, when, then }) => {
    let label: string;

    given(/um chip com label "(.*)" sem onDelete/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericChip label={label} />);
    });

    then("o ícone de exclusão não deve estar presente", () => {
      expect(document.querySelector(".MuiChip-deleteIcon")).not.toBeInTheDocument();
    });
  });

  test("Renderiza variante outlined corretamente", ({ given, when, then }) => {
    let label: string;

    given(/um chip com label "(.*)" e variante outlined/, (lbl: string) => {
      label = lbl;
    });

    when("o componente é renderizado", () => {
      render(<GenericChip label={label} variant="outlined" />);
    });

    then(/o texto "(.*)" deve estar no documento/, (text: string) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
