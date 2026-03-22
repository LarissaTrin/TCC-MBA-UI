Feature: Validação do schema de filtros do board

  Scenario: Aceita estado padrão com filtros vazios
    Given os valores padrão do BOARD_FILTER_DEFAULTS
    When o boardFilterSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Aceita combinação válida de filtros
    Given filtros com search "pagamento" tags "1,2" users "3" e datas "2026-01-01" a "2026-03-31"
    When o boardFilterSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Aceita arrays vazios para tags e users
    Given os valores padrão com tags e users como arrays vazios
    When o boardFilterSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: Aceita datas em formato string
    Given os valores padrão com dateFrom "2026-01-01" e dateTo "2026-12-31"
    When o boardFilterSchema valida os dados
    Then a validação deve ter sucesso

  Scenario: BOARD_FILTER_DEFAULTS tem todos os campos com valores vazios
    Given os valores padrão do BOARD_FILTER_DEFAULTS
    When os campos são verificados
    Then search deve ser string vazia
    And tags e users devem ser arrays vazios
    And dateFrom e dateTo devem ser strings vazias
