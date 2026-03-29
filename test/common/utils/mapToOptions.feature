Feature: Mapeamento para opções de Autocomplete

  Scenario: Mapeia itens para array AutocompleteOption
    Given uma lista com itens de id "1" nome "Frontend" e id "2" nome "Backend"
    When mapToOptions é chamado
    Then o resultado deve conter value "1" label "Frontend" e value "2" label "Backend"

  Scenario: Retorna array vazio para entrada vazia
    Given uma lista vazia
    When mapToOptions é chamado
    Then o resultado deve ser um array vazio

  Scenario: Item único é mapeado corretamente
    Given uma lista com item de id "abc" e nome "Tag"
    When mapToOptions é chamado
    Then o resultado deve ter 1 item com value "abc" e label "Tag"

  Scenario: Preserva a ordem dos itens
    Given uma lista com itens na ordem C, A, B com ids 3, 1, 2
    When mapToOptions é chamado
    Then os values do resultado devem estar na ordem "3", "1", "2"
