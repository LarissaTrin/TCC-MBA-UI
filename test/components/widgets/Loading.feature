Feature: Componente GenericLoading

  Scenario: Renderiza o spinner padrão
    Given o componente GenericLoading sem props
    When o componente é renderizado
    Then deve existir um indicador de progresso no documento

  Scenario: Renderiza o spinner com fullPage
    Given o componente GenericLoading com fullPage true
    When o componente é renderizado
    Then deve existir um indicador de progresso no documento

  Scenario: Renderiza sem wrapper quando fullPage é false
    Given o componente GenericLoading com fullPage false
    When o componente é renderizado
    Then deve existir um indicador de progresso no documento
