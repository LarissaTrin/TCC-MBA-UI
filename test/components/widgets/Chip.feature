Feature: Componente GenericChip

  Scenario: Renderiza o label correto
    Given um chip com label "Frontend"
    When o componente é renderizado
    Then o texto "Frontend" deve estar no documento

  Scenario: Chama onDelete ao clicar no ícone de exclusão
    Given um chip com label "Tag" e um handler onDelete
    When o ícone de exclusão é clicado
    Then o handler onDelete deve ter sido chamado uma vez

  Scenario: Não exibe ícone de exclusão quando onDelete não é passado
    Given um chip com label "Somente leitura" sem onDelete
    When o componente é renderizado
    Then o ícone de exclusão não deve estar presente

  Scenario: Renderiza variante outlined corretamente
    Given um chip com label "Outlined" e variante outlined
    When o componente é renderizado
    Then o texto "Outlined" deve estar no documento
