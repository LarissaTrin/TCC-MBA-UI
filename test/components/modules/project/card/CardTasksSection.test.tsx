import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardTasksSection } from "@/components/modules/project/card/CardTasksSection";
import { cardSchema, CardFormData } from "@/common/schemas/cardSchema";

const feature = loadFeature(path.join(__dirname, "CardTasksSection.feature"));

jest.mock("@/common/provider", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@/common/hooks", () => ({
  useProjectMemberSearch: jest.fn(() => ({
    options: [],
    loading: false,
    search: jest.fn(),
    seedOption: jest.fn(),
  })),
}));

const defaultValues: CardFormData = {
  id: 1,
  name: "Test Card",
  sectionId: "1",
  tasks: [],
  approvers: [],
  tags: [],
  blocked: false,
};

function TestWrapper() {
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues,
  });
  return <CardTasksSection form={form} projectId={1} />;
}

defineFeature(feature, (test) => {
  test("Exibe mensagem quando não há sub-tarefas", ({ given, when, then }) => {
    given("um formulário de card sem sub-tarefas", () => {});

    when("CardTasksSection é renderizado", () => {
      render(<TestWrapper />);
    });

    then("deve exibir a mensagem de lista vazia", () => {
      expect(screen.getByText("card.tasks.none")).toBeInTheDocument();
    });
  });

  test("Adiciona nova sub-tarefa ao clicar no botão adicionar", ({ given, when, then, and }) => {
    given("um formulário de card sem sub-tarefas", () => {
      render(<TestWrapper />);
    });

    when("o botão de adicionar sub-tarefa é clicado", () => {
      fireEvent.click(screen.getByText("card.tasks.add"));
    });

    then("deve aparecer um campo para o título da sub-tarefa", () => {
      expect(screen.getByPlaceholderText("card.tasks.titlePlaceholder")).toBeInTheDocument();
    });

    and("a mensagem de lista vazia não deve ser exibida", () => {
      expect(screen.queryByText("card.tasks.none")).not.toBeInTheDocument();
    });
  });

  test("Remove sub-tarefa ao clicar no botão deletar", ({ given, when, then }) => {
    let container: HTMLElement;

    given("um formulário de card com uma sub-tarefa adicionada", () => {
      ({ container } = render(<TestWrapper />));
      fireEvent.click(screen.getByText("card.tasks.add"));
      expect(screen.getByPlaceholderText("card.tasks.titlePlaceholder")).toBeInTheDocument();
    });

    when("o botão de deletar a sub-tarefa é clicado", () => {
      const deleteBtn = container.querySelector(".MuiIconButton-colorError");
      expect(deleteBtn).not.toBeNull();
      fireEvent.click(deleteBtn!);
    });

    then("a lista de sub-tarefas deve ficar vazia novamente", () => {
      expect(screen.getByText("card.tasks.none")).toBeInTheDocument();
    });
  });

  test("Permite adicionar múltiplas sub-tarefas", ({ given, when, then }) => {
    given("um formulário de card sem sub-tarefas", () => {
      render(<TestWrapper />);
    });

    when("o botão de adicionar sub-tarefa é clicado 3 vezes", () => {
      fireEvent.click(screen.getByText("card.tasks.add"));
      fireEvent.click(screen.getByText("card.tasks.add"));
      fireEvent.click(screen.getByText("card.tasks.add"));
    });

    then("devem aparecer 3 campos de título de sub-tarefa", () => {
      expect(screen.getAllByPlaceholderText("card.tasks.titlePlaceholder")).toHaveLength(3);
    });
  });
});
