Feature: Componente GenericBadge

  Scenario: Renderiza os children passados
    Given um badge com children "ícone"
    When o componente é renderizado
    Then o texto "ícone" deve estar no documento

  Scenario: Exibe a contagem correta no badge
    Given um badge com count 7
    When o componente é renderizado
    Then o número 7 deve estar no documento

  Scenario: Renderiza variante dot sem exibir contagem
    Given um badge com count 3 e variante dot
    When o componente é renderizado
    Then o badge deve estar no documento

  Scenario: Renderiza com contagem zero por padrão
    Given um badge sem count definido
    When o componente é renderizado
    Then o badge deve estar no documento
