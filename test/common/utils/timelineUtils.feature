Feature: Utilitários de timeline

  Scenario: getDaysDiff retorna 0 para datas iguais
    Given duas datas iguais
    When getDaysDiff é chamado
    Then o resultado deve ser 0

  Scenario: getDaysDiff retorna positivo quando end é maior que start
    Given start "2026-03-01" e end "2026-03-10"
    When getDaysDiff é chamado
    Then o resultado deve ser 9

  Scenario: getDaysDiff retorna negativo quando end é menor que start
    Given start "2026-03-10" e end "2026-03-01"
    When getDaysDiff é chamado
    Then o resultado deve ser -9

  Scenario: addDays adiciona o número correto de dias
    Given a data local 1 de março de 2026
    When addDays é chamado com 5 dias
    Then a data resultante deve ter dia 6

  Scenario: addDays não muta a data original
    Given a data local 15 de março de 2026
    When addDays é chamado com 5 dias
    Then a data original ainda deve ter dia 15

  Scenario: addDays lida com crossing de mês
    Given a data local 30 de janeiro de 2026
    When addDays é chamado com 3 dias
    Then a data resultante deve estar no mês de fevereiro

  Scenario: formatDate retorna string no padrão YYYY-MM-DD
    Given a data "2026-03-22T12:00:00Z"
    When formatDate é chamado
    Then o resultado deve seguir o padrão YYYY-MM-DD

  Scenario: generateTimelineMonths retorna a quantidade correta de meses
    Given uma data de referência com 1 mês antes e 4 meses depois
    When generateTimelineMonths é chamado
    Then o resultado deve ter 6 meses

  Scenario: generateTimelineMonths retorna os dias corretos por mês
    Given fevereiro de 2026 como mês de referência sem meses adjacentes
    When generateTimelineMonths é chamado
    Then o mês retornado deve ter 28 dias

  Scenario: generateTimelineMonths calcula o primeiro mês corretamente
    Given março de 2026 como referência com 2 meses antes
    When generateTimelineMonths é chamado
    Then o primeiro mês deve ser janeiro de 2026

  Scenario: generateTimelineMonths retorna meses com campos year month e days
    Given uma data de referência sem meses adjacentes
    When generateTimelineMonths é chamado
    Then cada mês deve ter os campos year, month e days
