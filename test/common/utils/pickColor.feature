Feature: Seleção de cor por status do card

  Scenario: Retorna laranja para status Pending
    Given um card com status Pending
    When pickColorByStatus é chamado
    Then a cor retornada deve ser "#f97316"

  Scenario: Retorna azul para status InProgress
    Given um card com status InProgress
    When pickColorByStatus é chamado
    Then a cor retornada deve ser "#3b82f6"

  Scenario: Retorna amarelo para status Validation
    Given um card com status Validation
    When pickColorByStatus é chamado
    Then a cor retornada deve ser "#eab308"

  Scenario: Retorna verde para status Done
    Given um card com status Done
    When pickColorByStatus é chamado
    Then a cor retornada deve ser "#10b981"

  Scenario: Retorna cinza para status desconhecido
    Given um card com status desconhecido
    When pickColorByStatus é chamado
    Then a cor retornada deve ser "#6b7280"
