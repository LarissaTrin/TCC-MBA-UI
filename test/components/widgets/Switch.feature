Feature: Componente GenericSwitch

  Scenario: Renderiza o label correto
    Given um switch com label "Ativar notificações"
    When o componente é renderizado
    Then o texto "Ativar notificações" deve estar no documento

  Scenario: Renderiza desabilitado quando disabled é true
    Given um switch com label "Modo escuro" e disabled true
    When o componente é renderizado
    Then o switch deve estar desabilitado

  Scenario: Renderiza marcado por padrão com defaultChecked
    Given um switch com label "Ativo" e defaultChecked true
    When o componente é renderizado
    Then o switch deve estar marcado

  Scenario: Renderiza desmarcado por padrão sem defaultChecked
    Given um switch com label "Inativo" sem defaultChecked
    When o componente é renderizado
    Then o switch deve estar desmarcado
