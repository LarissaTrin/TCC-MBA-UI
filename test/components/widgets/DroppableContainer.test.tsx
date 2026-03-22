import path from "path";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, screen, fireEvent } from "@testing-library/react";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";

const feature = loadFeature(path.join(__dirname, "DroppableContainer.feature"));

jest.mock("@dnd-kit/react", () => ({
  useDroppable: jest.fn(() => ({ ref: { current: null } })),
}));
jest.mock("@dnd-kit/abstract", () => ({
  CollisionPriority: { Low: 0 },
}));
jest.mock("@/components/widgets/Accordion", () => ({
  GenericAccordion: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
}));

function renderContainer(
  props: Partial<Parameters<typeof DroppableContainer>[0]> = {}
) {
  return render(
    <DroppableContainer id="col-1" title="To Do" {...props}>
      <div data-testid="card-item">Card 1</div>
    </DroppableContainer>
  );
}

defineFeature(feature, (test) => {
  test("Renderiza os children passados", ({ given, when, then }) => {
    given("um DroppableContainer com um elemento filho", () => {});

    when("o componente é renderizado", () => {
      renderContainer();
    });

    then("o elemento filho deve estar visível", () => {
      expect(screen.getByTestId("card-item")).toBeInTheDocument();
    });
  });

  test("Não exibe botão Load more quando hasMore é false", ({ given, when, then }) => {
    given("um DroppableContainer com hasMore igual a false", () => {});

    when("o componente é renderizado", () => {
      renderContainer({ hasMore: false });
    });

    then("o botão Load more não deve estar presente", () => {
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });
  });

  test("Exibe botão Load more quando hasMore é true", ({ given, when, then }) => {
    given("um DroppableContainer com hasMore igual a true", () => {});

    when("o componente é renderizado", () => {
      renderContainer({ hasMore: true, onLoadMore: jest.fn() });
    });

    then("o botão Load more deve estar presente", () => {
      expect(screen.getByRole("button", { name: /load more/i })).toBeInTheDocument();
    });
  });

  test("Chama onLoadMore ao clicar no botão Load more", ({ given, when, then }) => {
    const onLoadMore = jest.fn();

    given("um DroppableContainer com hasMore true e um handler onLoadMore", () => {
      renderContainer({ hasMore: true, onLoadMore });
    });

    when("o botão Load more é clicado", () => {
      fireEvent.click(screen.getByRole("button", { name: /load more/i }));
    });

    then("o handler onLoadMore deve ter sido chamado uma vez", () => {
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  test("Exibe spinner em vez do botão quando loadingMore é true", ({ given, when, then, and }) => {
    given("um DroppableContainer com hasMore true e loadingMore true", () => {});

    when("o componente é renderizado", () => {
      renderContainer({ hasMore: true, loadingMore: true });
    });

    then("o botão Load more não deve estar presente", () => {
      expect(screen.queryByRole("button", { name: /load more/i })).not.toBeInTheDocument();
    });

    and("um indicador de carregamento deve estar visível", () => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  test("Exibe campo de texto ao ativar triggerAdd", ({ given, when, then }) => {
    let rerender: (ui: React.ReactElement) => void;

    given("um DroppableContainer com triggerAdd inicialmente false", () => {
      ({ rerender } = render(
        <DroppableContainer
          id="col-1"
          title="To Do"
          onAddCard={jest.fn()}
          triggerAdd={false}
          onAddTriggerHandled={jest.fn()}
        >
          <div />
        </DroppableContainer>
      ));
    });

    when("triggerAdd muda para true", () => {
      rerender(
        <DroppableContainer
          id="col-1"
          title="To Do"
          onAddCard={jest.fn()}
          triggerAdd={true}
          onAddTriggerHandled={jest.fn()}
        >
          <div />
        </DroppableContainer>
      );
    });

    then("um campo de título de card deve aparecer", () => {
      expect(screen.getByPlaceholderText(/título do card/i)).toBeInTheDocument();
    });
  });
});
