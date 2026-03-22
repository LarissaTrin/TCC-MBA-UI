Feature: Componente DroppableContainer

  Scenario: Renderiza os children passados
    Given um DroppableContainer com um elemento filho
    When o componente é renderizado
    Then o elemento filho deve estar visível

  Scenario: Não exibe botão Load more quando hasMore é false
    Given um DroppableContainer com hasMore igual a false
    When o componente é renderizado
    Then o botão Load more não deve estar presente

  Scenario: Exibe botão Load more quando hasMore é true
    Given um DroppableContainer com hasMore igual a true
    When o componente é renderizado
    Then o botão Load more deve estar presente

  Scenario: Chama onLoadMore ao clicar no botão Load more
    Given um DroppableContainer com hasMore true e um handler onLoadMore
    When o botão Load more é clicado
    Then o handler onLoadMore deve ter sido chamado uma vez

  Scenario: Exibe spinner em vez do botão quando loadingMore é true
    Given um DroppableContainer com hasMore true e loadingMore true
    When o componente é renderizado
    Then o botão Load more não deve estar presente
    And um indicador de carregamento deve estar visível

  Scenario: Exibe campo de texto ao ativar triggerAdd
    Given um DroppableContainer com triggerAdd inicialmente false
    When triggerAdd muda para true
    Then um campo de título de card deve aparecer
